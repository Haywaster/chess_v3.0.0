import { isAxiosError } from 'axios'
import { useRef } from 'react'

import { StatusCodes, getTimeIn } from '@game-workspace/shared'

import { authService } from '../../service'
import { useReset, useSetOnline, useSetUserData } from '../../store'

interface UseRefreshToken {
  startInterval: () => void
  stopInterval: () => void
  refreshFunc: () => Promise<void>
}

type UseRefreshTokenReturn = [
  UseRefreshToken['startInterval'],
  UseRefreshToken['stopInterval'],
  UseRefreshToken['refreshFunc']
]

export const useRefreshToken = (): UseRefreshTokenReturn => {
  const setUserData = useSetUserData()
  const setOnline = useSetOnline()
  const resetUserData = useReset()
  const intervalRef = useRef<number>(undefined)

  const stopInterval = (): void => {
    clearInterval(intervalRef.current)
  }

  const refreshFunc = (): Promise<void> =>
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
        if (isAxiosError(err) && err.status === StatusCodes.UNAUTHORIZED) {
          stopInterval()
          resetUserData()
        }

        const onlineStatus = err.code !== 'ERR_NETWORK'
        setOnline(onlineStatus)
      })

  const startInterval = (): void => {
    intervalRef.current = setInterval(refreshFunc, getTimeIn(1, 'DAY', 'MS'))
  }

  return [startInterval, stopInterval, refreshFunc]
}
