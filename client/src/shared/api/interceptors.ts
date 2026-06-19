import { StatusCodes } from '@game-workspace/shared'

import type { useAuthStore } from 'features/auth'

import { rawApi } from './rawApi'

import type { AxiosInstance } from 'axios'

export const setupInterceptors = (
  instance: AxiosInstance,
  store: typeof useAuthStore
): AxiosInstance => {
  instance.interceptors.request.use(
    config => {
      const { token } = store.getState()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    error => Promise.reject(error)
  )

  instance.interceptors.response.use(
    config => config,
    async error => {
      const {
        isAuth,
        setOnline,
        setUserData,
        reset: resetUserData
      } = store.getState()
      const originalRequest = error.config
      const onlineStatus = error.code !== 'ERR_NETWORK'

      setOnline(onlineStatus)

      if (
        error.response?.status === StatusCodes.UNAUTHORIZED &&
        originalRequest &&
        !originalRequest._isRetry &&
        isAuth
      ) {
        originalRequest._isRetry = true

        try {
          const { data } = await rawApi('/refresh')

          setUserData({
            token: data.accessToken,
            username: data.user,
            isAuth: true
          })
          return instance.request(originalRequest)
        } catch {
          resetUserData()
        }
      }

      throw error
    }
  )

  return instance
}
