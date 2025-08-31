import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Theme } from 'shared/types'

interface State {
  rotate: boolean
  theme: Theme
}

interface Action {
  toggleRotate: () => void
  setTheme: (theme: Theme) => void
}

const initialState: State = {
  rotate: false,
  theme: 'light'
}

const useApplicationStore = create(
  persist<State & Action>(
    set => ({
      ...initialState,
      toggleRotate: () => set(state => ({ rotate: !state.rotate })),
      setTheme: theme => set({ theme })
    }),
    {
      name: 'application'
    }
  )
)

export const useToggleRotate = (): Action['toggleRotate'] =>
  useApplicationStore(state => state.toggleRotate)
export const useSetTheme = (): Action['setTheme'] =>
  useApplicationStore(state => state.setTheme)
export const useRotate = (): State['rotate'] =>
  useApplicationStore(state => state.rotate)
export const useTheme = (): State['theme'] =>
  useApplicationStore(state => state.theme)
