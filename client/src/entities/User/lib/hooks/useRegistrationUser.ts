import { userService } from '../../service'
import { useSetUserData } from '../../store'

export const useRegistrationUser = () => {
  const setUsername = useSetUserData()

  return async (username: string, password: string) => {
    const { data } = await userService.registration(username, password)
    setUsername({
      username: data.user,
      token: data.accessToken,
      isAuth: true
    })
  }
}
