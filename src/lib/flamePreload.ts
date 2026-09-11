// `flamePaths.ts` pesa ~90KB (son los 19 frames vectorizados de la llama). En vez de
// sumarlo al bundle principal, se separa en su propio chunk (import() dinámico) y se
// dispara la descarga apenas arranca el wizard de "crear pelea" — bastante antes de
// llegar a la pantalla "¡Todo listo!" donde realmente se usa. Así, cuando FlameBurst
// se monta, los datos ya están en caché y no hay ningún salto/parpadeo esperando la carga.
type FlameData = typeof import('../data/flamePaths')

let flameDataPromise: Promise<FlameData> | null = null

export function preloadFlameData(): Promise<FlameData> {
  flameDataPromise ??= import('../data/flamePaths')
  return flameDataPromise
}
