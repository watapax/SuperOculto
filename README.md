# KOF Torneo Manager

App (PWA) para gestionar puntajes de campeonatos de *The King of Fighters*.
Funciona completamente offline: todos los datos (jugadores, personajes, partidas,
temporadas) se guardan solo en el dispositivo (`localStorage`), sin backend ni nube.

## Funcionalidades

- Alta de jugadores.
- Selección de juego (KOF '94 a KOF 2002) y asignación de los personajes que usa
  cada jugador en ese juego.
- Registro manual de partidas (juego, jugadores, personajes usados, rounds y ganador).
- Temporadas: agrupá las partidas y llevá puntajes separados por temporada.
- Tabla de posiciones (puntos, victorias/derrotas, % de victorias, rounds) y
  estadísticas de personajes más usados, filtrables por temporada y por juego.
- Instalable como PWA (funciona sin conexión luego de la primera carga).

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Stack

React + TypeScript + Vite, Zustand (con persistencia en `localStorage`),
React Router, Tailwind CSS y `vite-plugin-pwa`.
