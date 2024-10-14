import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Theme } from '../types'

interface State {
  theme: Theme
}

interface Action {
  setTheme: (theme: Theme) => void
}

export const useTheme = create(
  persist<State & Action>(
    set => ({
      theme: 'light',
      setTheme: theme => set({ theme })
    }),
    {
      name: 'theme'
    }
  )
)
