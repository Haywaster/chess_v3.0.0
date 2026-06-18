import { authService } from '../../service'
import { useSetUserData } from '../../store'

export const useRegistrationUser = () => {
  const setUserData = useSetUserData()

  return async (username: string, password: string) => {
    authService.registration(username, password).then(({ data }) => {
      setUserData({
        username: data.user,
        token: data.accessToken,
        isAuth: true
      })
    })
  }
}
