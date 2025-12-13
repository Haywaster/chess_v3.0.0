import { authService } from '../../service'
import { useReset } from '../../store'

export const useLogoutUser = () => {
  const reset = useReset()

  return async () => {
    try {
      await authService.logout()
      reset()
    } catch {
      // console.log(e)
    }
  }
}
