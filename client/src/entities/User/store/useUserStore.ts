import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  username: string
}

interface Action {
  setUsername: (username: string) => void
}

const initialState: State = {
  username: ''
}

const useGameStore = create(
  persist<State & Action>(
    set => ({
      ...initialState,
      setUsername: username => set({ username })
    }),
    //TODO: В будущем не нужно хранить данные пользователя в локал сторедж
    {
      name: 'user'
    }
  )
)

export const useUsername = (): State['username'] =>
  useGameStore(state => state.username)
export const useSetUsername = (): Action['setUsername'] =>
  useGameStore(state => state.setUsername)
