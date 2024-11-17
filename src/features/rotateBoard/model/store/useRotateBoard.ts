import { create } from 'zustand'

interface State {
  rotate: boolean
}

interface Action {
  toggleRotate: () => void
}

export const useRotateBoard = create<State & Action>(set => ({
  rotate: false,
  toggleRotate: () => set(state => ({ rotate: !state.rotate }))
}))
