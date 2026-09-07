import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
      <Outlet />
      <footer className="px-4 pb-4 pt-8 text-center text-xs text-edge">
        Campeonato compartido — los datos viven en el servidor.
      </footer>
    </div>
  )
}
