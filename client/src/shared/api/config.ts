import axios from 'axios'

import { useUserStore } from 'entities/User'
import { StatusCodes } from 'shared/const/statuses'

import { instance } from './instance.ts'

instance.interceptors.request.use(
  config => {
    const token = useUserStore.getState().token
    config.headers.Authorization = token ? `Bearer ${token}` : undefined
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  config => {
    return config
  },
  async error => {
    const originalRequest = error.config
    const { isAuth, setOnline, setUserData } = useUserStore.getState()

    if (error.code === 'ERR_NETWORK') {
      setOnline(false)
    }

    if (
      error.response?.status === StatusCodes.UNAUTHORIZED &&
      originalRequest &&
      !originalRequest._isRetry &&
      isAuth
    ) {
      originalRequest._isRetry = true
      try {
        const { data } = await axios('/refresh', {
          withCredentials: true
        })
        setUserData({
          token: data.accessToken,
          isAuth: true,
          username: data.user
        })
        return instance.request(originalRequest)
      } catch {
        setUserData({ isAuth: false, token: '', username: '' })
      }
    }

    throw error
  }
)

export default instance
