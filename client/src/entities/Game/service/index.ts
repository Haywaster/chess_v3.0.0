import type { AxiosPromise } from 'axios'

import $api from 'shared/api/config'

import type { ICreateGameData } from '../model'

interface GameService {
  createGame(data: ICreateGameData): AxiosPromise<string>
}

export const gameService: GameService = {
  async createGame(data) {
    return await $api('/game', { method: 'POST', data })
  }
}
