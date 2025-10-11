import { type AxiosPromise } from 'axios'

import $api from 'shared/api/config.ts'
import { instance } from 'shared/api/instance.ts'

interface ITokenCouple {
  accessToken: string
  refreshToken: string
}

interface ILoginResult extends ITokenCouple {
  user: string
}

interface UserService {
  login(login: string, password: string): AxiosPromise<ILoginResult>
  registration(login: string, password: string): AxiosPromise<ILoginResult>
  getUsers(): AxiosPromise<void>
}

export const authService = {
  async refresh() {
    return await instance('/refresh')
  }
}

export const userService: UserService = {
  async getUsers() {
    return await $api('/users')
  },
  async login(login, password) {
    return await instance('/login', {
      method: 'POST',
      data: { login, password }
    })
  },
  async registration(login, password) {
    return await instance('/registration', {
      method: 'POST',
      data: { login, password }
    })
  }
}
