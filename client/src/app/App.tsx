import { type FC, useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { AppRouter } from 'app/router'
import { useIsAuth, useRefreshToken } from 'entities/User'

const router = createBrowserRouter(AppRouter)

export const App: FC = () => {
  const isAuth = useIsAuth()
  const authChecked = useRef(false)

  const [startInterval, stopInterval, refreshFunc] = useRefreshToken()

  useEffect(() => {
    if (authChecked.current) {
      startInterval()

      return () => {
        stopInterval()
      }
    }

    if (!isAuth) {
      refreshFunc()
    }

    authChecked.current = true
  }, [isAuth, startInterval, stopInterval, refreshFunc])

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}
