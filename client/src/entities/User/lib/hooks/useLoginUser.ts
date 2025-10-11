import { userService } from 'entities/User/service'

import { useSetUserData } from '../../store'

export const useLoginUser = () => {
  const setUsername = useSetUserData()

  return async (username: string, password: string) => {
    const { data } = await userService.login(username, password)
    setUsername({
      username: data.user,
      token: data.accessToken,
      isAuth: true
    })
  }
}
