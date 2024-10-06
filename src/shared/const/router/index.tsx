import { Main as MainPage } from 'pages/Main'
import type { RouteObject } from 'react-router-dom'

enum RouterPath {
  Home = '/'
}

export const AppRouter: RouteObject[] = [
  {
    path: RouterPath.Home,
    element: <MainPage />
  }
]
