# Super Ocultos

App (PWA) para el campeonato "Super Ocultos" de *The King of Fighters*: en vez de
llevar la cuenta de quién gana cada partida, cuenta cuántos **movimientos
especiales** recibe cada jugador durante una pelea.

## Funcionalidades

- Alta de jugadores.
- Crear pelea: elegís el juego (KOF '94 a KOF 2002) y, para esa pelea puntual,
  los personajes de cada jugador.
- Pelea en vivo: pantalla dividida en dos (jugador arriba/abajo). Tocás la zona
  del jugador que recibió un golpe especial y suma al contador, con explosión
  de partículas y screen shake. Botón para deshacer un toque de más, y para
  finalizar y guardar la pelea.
- Estadísticas: ranking de jugadores por golpes especiales recibidos,
  personajes más usados, e historial de peleas.
- Instalable como PWA.

## Arquitectura

- **Frontend**: React + TypeScript + Vite, Zustand (estado en memoria,
  hidratado desde el servidor al arrancar), React Router, Tailwind CSS y
  `vite-plugin-pwa`.
- **Backend**: Express (`server/`) sirve tanto la API (`/api/players`,
  `/api/fights`) como los archivos estáticos de la build (`dist/`), con
  fallback a `index.html` para las rutas de React Router.
- **Base de datos**: Postgres (dos tablas: `players` y `fights`). Todos los
  dispositivos que abren la app ven el mismo campeonato.

## Desarrollo local

Necesitás una base Postgres corriendo (local o remota) y la variable
`DATABASE_URL` apuntando a ella.

```bash
npm install

# Terminal 1: backend (API), escucha en :8787 por defecto
DATABASE_URL="postgresql://usuario:pass@localhost:5432/super_ocultos" npm run dev:server

# Terminal 2: frontend (Vite), proxea /api hacia localhost:8787
npm run dev
```

## Build y arranque de producción

```bash
npm run build   # compila el frontend a dist/
DATABASE_URL="postgresql://..." npm start   # levanta server/index.js, sirve dist/ + API
```

## Deploy en Railway

1. Creá el proyecto apuntando a este repo (rama con la app).
2. Agregá un plugin de **PostgreSQL** en el mismo proyecto.
3. En el servicio web, agregá la variable `DATABASE_URL` referenciando la del
   plugin de Postgres (botón "Add Reference" al crear la variable).
4. Railway detecta Node automáticamente, corre `npm install`, `npm run build`
   y arranca con `npm start`. El server crea las tablas solo la primera vez
   que arranca.
5. Generá el dominio público en Settings → Networking → "Generate Domain".
