/**
 * Ease-out-sine: arranca rápido y frena suave hacia el final (curva de
 * easings.net). Da sensación de "vuelo"/impacto de videojuego en vez de un
 * fade genérico: el elemento llega con energía y se asienta con suavidad.
 */
export const easeOutSine = [0.61, 1, 0.88, 1] as const

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 18, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: easeOutSine },
  },
}

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
}

/**
 * Escena de pelea (LiveFightPage): orquesta, en orden, la aparición del
 * encabezado, la zona de cada jugador, la línea divisoria y el "VS". Todo
 * arranca invisible y se va sumando de a poco.
 */
export const fightSceneContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.04 },
  },
}

export const fightHeaderReveal = {
  hidden: { opacity: 0, y: -14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeOutSine } },
}

/** La zona del jugador de arriba entra "volando" desde afuera de la pantalla. */
export const zoneSlideInTop = {
  hidden: { opacity: 0, y: -64 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutSine } },
}

/** La zona del jugador de abajo entra desde el borde inferior. */
export const zoneSlideInBottom = {
  hidden: { opacity: 0, y: 64 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutSine } },
}

/** Dentro de cada zona, la barra de nombre y las columnas de personajes se cascadean por separado. */
export const zoneContentStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

/** Línea divisoria: se "desenvaina" desde el centro hacia los costados. */
export const dividerReveal = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.4, ease: easeOutSine } },
}

/** El "VS" llega último, con un golpe de impacto. */
export const vsPunchIn = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOutSine } },
}
