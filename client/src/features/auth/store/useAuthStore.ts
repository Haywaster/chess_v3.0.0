import { create } from 'zustand'

interface State {
  username: string
  token: string
  isAuth: boolean
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

export const useAuthStore = create<State & Action>(set => ({
  ...initialState,
  setUserData: data => set(prev => ({ ...prev, ...data })),
  setOnline: online => set({ online }),
  reset: () => set({ ...userInitialState })
}))

export const useUsername = (): State['username'] =>
  useAuthStore(state => state.username)
export const useToken = (): State['token'] => useAuthStore(state => state.token)
export const useIsAuth = (): State['isAuth'] =>
  useAuthStore(state => state.isAuth)
export const useOnline = (): State['online'] =>
  useAuthStore(state => state.online)

export const useSetUserData = (): Action['setUserData'] =>
  useAuthStore(state => state.setUserData)
export const useReset = (): Action['reset'] =>
  useAuthStore(state => state.reset)
export const useSetOnline = (): Action['setOnline'] =>
  useAuthStore(state => state.setOnline)
