const SHORT_NAME_OVERRIDES: Record<string, string> = {
  'Mr. Big': 'Big',
}

/** Nombre corto para mostrar en UI (sin apellido), ej. "Kyo Kusanagi" -> "Kyo". */
export function shortCharacterName(fullName: string): string {
  return SHORT_NAME_OVERRIDES[fullName] ?? fullName.split(' ')[0]
}
