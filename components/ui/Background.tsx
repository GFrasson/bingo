"use client"

export function Background() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-background">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-in fade-in duration-1000" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-300" />

      {/* Decorative SVGs for Bridal Shower / Kitchen Tea */}

      {/* Top Left: Tea Cup */}
      <svg className="absolute top-10 left-10 w-24 h-24 text-primary/10 rotate-[-15deg]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
      </svg>

      {/* Top Right: Heart */}
      <svg className="absolute top-20 right-20 w-32 h-32 text-rose-300/10 rotate-[15deg] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* Bottom Right: Whisk / Kitchen Tool */}
      <svg className="absolute bottom-20 right-10 w-40 h-40 text-rose-400/5 rotate-[-10deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M16.6 6.3l3.5-3.5 1.4 1.4-3.5 3.5-1.4-1.4zM9.5 13.4l3.5-3.5 1.4 1.4-3.5 3.5-1.4-1.4zM2.4 20.5l3.5-3.5 1.4 1.4-3.5 3.5-1.4-1.4zM7 17l-1 1-2 4 4-2 1-1-2-2z" />
      </svg>

      {/* Center-ish: Floral Pattern (Abstracted) */}
      <div className="absolute top-1/2 left-1/4 opacity-[0.03] text-primary">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>

    </div>
  )
}
