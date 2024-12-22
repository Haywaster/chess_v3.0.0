import { create } from 'zustand'

interface State {
  ws: WebSocket | null
}

interface Action {
  setWs: (ws: WebSocket | null) => void
}

export const useWebsocket = create<State & Action>(set => ({
  ws: null,
  setWs: ws => set({ ws })
}))
