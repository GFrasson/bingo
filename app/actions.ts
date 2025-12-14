'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { THEMES, getRandomBoard } from "@/lib/themes"
import { cookies } from "next/headers"
import { realtime } from '@/lib/realtime/pusher-server'
import { revalidatePath } from "next/cache"

export async function createRoom() {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()

  const room = await prisma.room.create({
    data: {
      code,
      theme: 'cha_de_panela',
      status: 'WAITING'
    }
  })

  redirect(`/room/${room.id}?admin=true`)
}

export async function joinRoom(formData: FormData) {
  const code = (formData.get('code') as string).toUpperCase()
  const name = formData.get('name') as string

  const room = await prisma.room.findUnique({
    where: { code }
  })

  if (!room) {
    throw new Error("Room not found")
  }

  const boardWords = getRandomBoard(room.theme as keyof typeof THEMES)

  const player = await prisma.player.create({
    data: {
      name,
      roomId: room.id,
      board: {
        create: boardWords.map((word, index) => ({
          word,
          position: index,
          marked: false
        }))
      }
    }
  });

  (await cookies()).set('playerId', player.id)

  redirect(`/room/${room.id}?name=${encodeURIComponent(name)}`)
}

export async function drawWord(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { draws: true }
  })

  if (!room) return null

  const themeWords = THEMES[room.theme as keyof typeof THEMES] || THEMES.cha_de_panela
  const drawnWords = new Set(room.draws.map(d => d.word))

  const available = themeWords.filter(w => !drawnWords.has(w))

  if (available.length === 0) return null

  const word = available[Math.floor(Math.random() * available.length)]

  await prisma.draw.create({
    data: {
      roomId,
      word
    }
  })

  await realtime.trigger(`room-${roomId}`, 'draw', { word })

  return word;
}


export async function startGame(roomId: string) {
  await prisma.room.update({
    where: { id: roomId },
    data: { status: 'PLAYING' }
  })

  // Notify clients? Simple refresh or realtime event.
  await realtime.trigger(`room-${roomId}`, 'game_started', {})
  revalidatePath(`/room/${roomId}`)
}


export async function markBoard(playerId: string, word: string) {
  // 1. Get player to find room
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      room: {
        include: { draws: true }
      }
    }
  })

  if (!player) {
    return { error: "Player not found" }
  }

  // 2. Strict Validation: Check if word is in room.draws
  const isDrawn = player.room.draws.some(d => d.word === word)

  if (!isDrawn) {
    return { error: "Cheater! This word has not been drawn yet." }
  }

  // 3. Update
  await prisma.boardItem.updateMany({
    where: { playerId, word },
    data: { marked: true }
  })

  return { success: true }
}

export async function declareBingo(playerId: string, roomId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } })
  if (player) {
    await prisma.player.update({
      where: { id: playerId },
      data: { isBingo: true }
    })
    // Ensure we send ALL info needed for admin to show a list
    await realtime.trigger(`room-${roomId}`, 'bingo', {
      playerId: player.id,
      playerName: player.name,
      timestamp: new Date()
    })
  }
}

export async function endGame(roomId: string) {
  await prisma.room.update({
    where: { id: roomId },
    data: { status: 'ENDED' }
  })
  await realtime.trigger(`room-${roomId}`, 'game_ended', {})
  revalidatePath(`/room/${roomId}`)
}
