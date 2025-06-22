import { create } from 'zustand'

interface State {
  ws: WebSocket | null
}

interface Action {
  setWs: (ws: WebSocket | null) => void
}

const useWebsocketStore = create<State & Action>(set => ({
  ws: null,
  setWs: ws => set({ ws })
}))

export const useWs = (): State['ws'] => useWebsocketStore(state => state.ws)
export const useSetWs = (): Action['setWs'] =>
  useWebsocketStore(state => state.setWs)
