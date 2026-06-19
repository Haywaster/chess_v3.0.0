import $api from 'shared/api'

import type { IAuthService } from '../model'

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
