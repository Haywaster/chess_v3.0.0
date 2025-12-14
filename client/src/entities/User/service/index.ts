import { type AxiosPromise } from 'axios'

import $api from 'shared/api/config'

interface ITokenCouple {
  accessToken: string
  refreshToken: string
}

interface ILoginResult extends ITokenCouple {
  user: string
}

interface IAuthService {
  login(login: string, password: string): AxiosPromise<ILoginResult>
  registration(login: string, password: string): AxiosPromise<ILoginResult>
  logout(): AxiosPromise<void>
  refresh(): AxiosPromise<ILoginResult>
}

interface UserService {
  getUsers(): AxiosPromise<void>
}

export const authService: IAuthService = {
  async refresh() {
    return await $api('/refresh')
  },
  async login(login, password) {
    return await $api('/login', {
      method: 'POST',
      data: { login, password }
    })
  },
  async registration(login, password) {
    return await $api('/registration', {
      method: 'POST',
      data: { login, password }
    })
  },
  async logout() {
    return await $api('/logout', { method: 'POST' })
  }
}

export const userService: UserService = {
  async getUsers() {
    return await $api('/users')
  }
}
