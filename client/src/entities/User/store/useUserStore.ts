import { create } from 'zustand'

interface State {
  username: string
  token: string
  isAuth: boolean // прошла ли попытка refresh
}

interface Action {
  setUserData: (data: Partial<State>) => void
  reset: () => void
}

const initialState: State = {
  username: '',
  token: '',
  isAuth: false
}

export const useUserStore = create<State & Action>(set => ({
  ...initialState,
  setUserData: data => set(prev => ({ ...prev, ...data })),
  reset: () => set({ ...initialState })
}))

export const useUsername = (): State['username'] =>
  useUserStore(state => state.username)
export const useToken = (): State['token'] => useUserStore(state => state.token)
export const useIsAuth = (): State['isAuth'] =>
  useUserStore(state => state.isAuth)

export const useSetUserData = (): Action['setUserData'] =>
  useUserStore(state => state.setUserData)
export const useReset = (): Action['reset'] =>
  useUserStore(state => state.reset)
