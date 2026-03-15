import type { AxiosPromise } from 'axios'

import $api from 'shared/api/config'

import type { ICreateGameData } from '../model'

interface GameService {
  createGame(type: ICreateGameData): AxiosPromise<string>
}

export const gameService: GameService = {
  async createGame(type) {
    return await $api('/game', { method: 'POST', data: { type } })
  }
}
