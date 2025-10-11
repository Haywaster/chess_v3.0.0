import { isAxiosError } from 'axios'
import { useRef } from 'react'

import { StatusCodes } from 'shared/const/statuses'
import { getTimeIn } from 'shared/lib/utils/getTimeIn.ts'

import { authService } from '../../service'
import { useSetUserData } from '../../store'

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
  const intervalRef = useRef<NodeJS.Timeout>()

  const stopInterval = (): void => {
    clearInterval(intervalRef.current)
  }

  const refreshFunc = (): void => {
    authService
      .refresh()
      .then(({ data }) =>
        setUserData({
          token: data.accessToken,
          username: data.user,
          isAuth: true
        })
      )
      .catch(err => {
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
