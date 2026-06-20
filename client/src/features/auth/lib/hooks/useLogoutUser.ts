import { authService } from '../../service'
import { useReset } from '../../store'

export const useLogoutUser = () => {
  const reset = useReset()

  return () => authService.logout().then(() => reset())
}
