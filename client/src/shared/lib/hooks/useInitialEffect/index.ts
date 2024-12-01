import { useEffect } from 'react'

export const useInitialEffect = (callback: () => void): void => {
  useEffect(() => {
    callback()
    // eslint-disable-next-line
  }, [])
}
