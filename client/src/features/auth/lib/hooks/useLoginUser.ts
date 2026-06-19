import { authService } from '../../service'
import { useSetUserData } from '../../store'

export const useLoginUser = () => {
  const setUserData = useSetUserData()

  return async (username: string, password: string) => {
    authService.login(username, password).then(({ data }) => {
      setUserData({
        username: data.user,
        token: data.accessToken,
        isAuth: true
      })
    })
  }
}
