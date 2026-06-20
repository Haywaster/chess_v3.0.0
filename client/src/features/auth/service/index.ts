import $api, { rawApi } from 'shared/api'

import type { IAuthService } from '../model'

export const authService: IAuthService = {
  async refresh() {
    return await rawApi('/refresh')
  },
  async login(login, password) {
    return await rawApi('/login', {
      method: 'POST',
      data: { login, password }
    })
  },
  async registration(login, password) {
    return await rawApi('/registration', {
      method: 'POST',
      data: { login, password }
    })
  },
  async logout() {
    return await $api('/logout', { method: 'POST' })
  }
}
