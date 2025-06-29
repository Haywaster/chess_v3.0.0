import type { FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AppRouter } from 'app/router'
import { useWebSocketConnection } from 'shared/lib/hooks/websocket/useWebSocketConnection.ts'

const WEBSOCKET_SERVER = 'ws://localhost:8080'

const router = createBrowserRouter(AppRouter)

export const App: FC = () => {
  useWebSocketConnection(WEBSOCKET_SERVER)

  return <RouterProvider router={router} />
}
