import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
      <Outlet />
    </div>
  )
}
