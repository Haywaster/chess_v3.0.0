import { userService } from 'entities/User/service'

import { useReset } from '../../store'

export const useLogoutUser = () => {
  const reset = useReset()

  return async () => {
    try {
      await userService.logout()
      reset()
    } catch {
      // console.log(e)
    }
  }
}
