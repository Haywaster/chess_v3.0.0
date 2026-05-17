import { isAxiosError } from 'axios'
import { useRef } from 'react'

import { StatusCodes } from 'shared/const/statuses'
import { getTimeIn } from 'shared/lib'

import { authService } from '../../service'
import { useSetOnline, useSetUserData } from '../../store'

interface UseRefreshToken {
  startInterval: () => void
  stopInterval: () => void
  refreshFunc: () => void
}

type UseRefreshTokenReturn = [
  UseRefreshToken['startInterval'],
  UseRefreshToken['stopInterval'],
  UseRefreshToken['refreshFunc']
]

export const useRefreshToken = (): UseRefreshTokenReturn => {
  const setUserData = useSetUserData()
  const setOnline = useSetOnline()
  const intervalRef = useRef<NodeJS.Timeout>()

  const stopInterval = (): void => {
    clearInterval(intervalRef.current)
  }

  const refreshFunc = (): void => {
    authService
      .refresh()
      .then(({ data }) => {
        setUserData({
          token: data.accessToken,
          username: data.user,
          isAuth: true
        })
        setOnline(true)
      })
      .catch(err => {
        const userOnline = err.code !== 'ERR_NETWORK'
        setOnline(userOnline)

        if (isAxiosError(err) && err.status === StatusCodes.UNAUTHORIZED) {
          setUserData({ isAuth: false })
          stopInterval()
        }
      })
  }

  const startInterval = (): void => {
    intervalRef.current = setInterval(refreshFunc, getTimeIn(1, 'DAY', 'MS'))
  }

  return [startInterval, stopInterval, refreshFunc]
}
