export const THEMES = {
  cha_de_panela: [
    "Liquidificador", "Batedeira", "Panela de Pressão", "Faqueiro",
    "Jogo de Jantar", "Toalha de Mesa", "Potes Plásticos", "Escorredor de Arroz",
    "Tábua de Corte", "Ralador", "Colheres de Pau", "Avental",
    "Forma de Bolo", "Assadeira", "Espremedor de Alho", "Abridor de Latas",
    "Escumadeira", "Concha", "Fouet", "Xícaras de Café",
    "Copos", "Jarra de Suco", "Petisqueira", "Saladeira",
    "Travessa", "Descanso de Panela", "Luva Térmica", "Rodo de Pia",
    "Lixeira de Pia", "Vassoura", "Pá de Lixo", "Balde",
    "Pregadores", "Pano de Prato", "Saca-Rolhas", "Amassador de Batata"
  ]
}

export function getRandomBoard(theme: keyof typeof THEMES): string[] {
  const words = THEMES[theme] || THEMES['cha_de_panela'];
  // Shuffle and pick 25
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 25);
}
