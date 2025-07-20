import type { FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AppRouter } from 'app/router'

const router = createBrowserRouter(AppRouter)

export const App: FC = () => <RouterProvider router={router} />
