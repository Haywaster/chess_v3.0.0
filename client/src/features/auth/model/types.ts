import type { AxiosPromise } from 'axios'

interface ITokenCouple {
  accessToken: string
  refreshToken: string
}

interface ILoginResult extends ITokenCouple {
  user: string
}

export interface IAuthService {
  login(login: string, password: string): AxiosPromise<ILoginResult>
  registration(login: string, password: string): AxiosPromise<ILoginResult>
  logout(): AxiosPromise<void>
  refresh(): AxiosPromise<ILoginResult>
}
