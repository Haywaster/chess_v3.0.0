import { create } from 'zustand'

interface State {
  username: string
  token: string
  isAuth: boolean // прошла ли попытка refresh
  online: boolean
}

interface Action {
  setUserData: (data: Partial<Omit<State, 'online'>>) => void
  setOnline: (online: State['online']) => void
  reset: () => void
}

const userInitialState: Omit<State, 'online'> = {
  username: '',
  token: '',
  isAuth: false
}

const initialState: State = {
  ...userInitialState,
  online: false
}

export const useUserStore = create<State & Action>(set => ({
  ...initialState,
  setUserData: data => set(prev => ({ ...prev, ...data })),
  setOnline: online => set({ online }),
  reset: () => set({ ...userInitialState })
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
