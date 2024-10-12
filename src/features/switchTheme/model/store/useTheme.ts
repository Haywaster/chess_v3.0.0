import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Theme } from '../types'

type State = {
  theme: Theme
}

type Action = {
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
