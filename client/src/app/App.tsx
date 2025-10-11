import { type FC, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AppRouter } from 'app/router'
import { useIsAuth, useRefreshToken } from 'entities/User'

const router = createBrowserRouter(AppRouter)

export const App: FC = () => {
  const isAuth = useIsAuth()
  const [startInterval, stopInterval, refreshFunc] = useRefreshToken()

  useEffect(() => {
    if (isAuth) {
      startInterval()
    } else {
      refreshFunc()
    }

    return () => {
      stopInterval()
    }
  }, [startInterval, stopInterval, refreshFunc, isAuth])

  return <RouterProvider router={router} />
}
