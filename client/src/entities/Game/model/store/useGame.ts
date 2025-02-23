import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  username: string
}

interface Action {
  setUsername: (username: string) => void
}

export const useGame = create(
  persist<State & Action>(
    set => ({
      username: '',
      setUsername: username => set({ username })
    }),
    {
      name: 'game'
    }
  )
)
