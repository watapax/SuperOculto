/**
 * Avatares juguetones y genéricos (emoji) para asignarle a un jugador,
 * como reemplazo del recuadro de iniciales. Sin relación con personajes
 * de ningún juego — evita cualquier problema de derechos de imagen.
 */
export const PLAYER_AVATARS: string[] = [
  '😎', '🔥', '👑', '🐉', '🦁', '🐯', '🐺', '🦅',
  '💀', '🥷', '🤖', '👹', '👻', '🎯', '🃏', '🧨',
  '⚡', '🌟', '🍀', '🎮', '🥊', '🎲', '🦂', '🐍',
  '🦈', '🐲', '👊', '🔱', '🎃', '🦖', '🐸', '🦍',
]

export function randomPlayerAvatar(): string {
  return PLAYER_AVATARS[Math.floor(Math.random() * PLAYER_AVATARS.length)]
}
