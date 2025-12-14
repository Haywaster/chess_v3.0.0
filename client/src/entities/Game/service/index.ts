import { type AxiosPromise } from 'axios'

import $api from 'shared/api/config'

import { type TGameType } from '../model'

interface GameService {
  createGame(type: TGameType): AxiosPromise<string>
}

export const gameService: GameService = {
  async createGame(type: TGameType) {
    return await $api('/game', { method: 'POST', data: { type } })
  }
}
