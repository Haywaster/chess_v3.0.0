import { create } from 'zustand'

import { type IGame } from '../model'

interface State {
  game: IGame | null
}

interface Action {
  setGame: (game: IGame | null) => void
}

const initialState: State = {
  game: null
}

const useGameStore = create<State & Action>(set => ({
  ...initialState,
  setGame: game => set({ game })
}))

export const useGame = (): State['game'] => useGameStore(state => state.game)
export const useSetGame = (): Action['setGame'] =>
  useGameStore(state => state.setGame)
