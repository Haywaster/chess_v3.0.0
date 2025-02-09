import type { FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AppRouter } from 'app/router'
import { useConnectWebsocket } from 'shared/api'

const router = createBrowserRouter(AppRouter)

export const App: FC = () => {
  useConnectWebsocket()

  return <RouterProvider router={router} />
}
