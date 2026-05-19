import { type RouteObject } from 'react-router'

import { id, RouterPath } from 'shared/const/router'
import { Loader } from 'shared/ui'

const getRouteWithId = (route: string, id?: string): string =>
  id ? `${route}/:${id}` : route

export const AppRouter: RouteObject[] = [
  {
    hydrateFallbackElement: <Loader fullScreen />,
    children: [
      {
        path: RouterPath.HOME,
        lazy: async () => ({
          Component: (await import('pages/Main')).Main
        })
      },
      {
        path: getRouteWithId(RouterPath.CHECKERS, id),
        lazy: async () => ({
          Component: (await import('pages/Checkers')).Checkers
        })
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('pages/NotFound')).NotFound
        })
      }
    ]
  }
]
