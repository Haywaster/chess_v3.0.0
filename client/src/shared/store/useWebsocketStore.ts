/* eslint-disable no-console */

import { create } from 'zustand'

import { WebSocketStatus } from 'shared/const/statuses.ts'
import {
  type WebsocketDataConstructor,
  type MessageListener,
  type TWebSocketStatus
} from 'shared/types'

interface State {
  socket: WebSocket | null
  listeners: Record<string, MessageListener[]>
  status: TWebSocketStatus
}

interface Action {
  setStatus: (WebSocketStatus: TWebSocketStatus) => void
  sendMessage: MessageListener
  connect: (url: string) => void
  subscribe: (messageType: string, callback: MessageListener) => void
}

const initialState: State = {
  socket: null,
  listeners: {},
  status: WebSocketStatus.CLOSED
}

export const useWebsocketStore = create<State & Action>((set, get) => ({
  ...initialState,
  setStatus: status => set({ status }),
  sendMessage: message => {
    const { socket } = get()

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket не подключен')
    }
  },
  connect: url => {
    const { socket } = get()

    if (socket?.readyState === WebSocket.OPEN) {
      return
    }

    set({ status: WebSocketStatus.CONNECTING })

    const ws = new WebSocket(url)

    ws.onopen = () => {
      set({ socket: ws, status: WebSocketStatus.OPEN })
      console.log('WebSocket connected')
    }
    ws.onmessage = (event: MessageEvent<string>) => {
      const { listeners } = get()

      try {
        const message = JSON.parse(event.data) as WebsocketDataConstructor
        if (message.type in listeners) {
          listeners[message.type].forEach(callback => callback(message))
        }
      } catch (error) {
        console.error('Ошибка парсинга WebSocket сообщения:', error)
      }
    }
    ws.onclose = () => {
      set({ status: WebSocketStatus.CLOSED })
      console.log('WebSocket disconnected')
    }
    ws.onerror = error => {
      console.error('WebSocket error:', error)
      set({ status: WebSocketStatus.CLOSED })
    }
  },
  subscribe: (messageType, callback) => {
    set(state => {
      const listeners = { ...state.listeners }

      if (!(messageType in listeners)) {
        listeners[messageType] = []
      }
      listeners[messageType] = [...listeners[messageType], callback]
      return { listeners }
    })

    return () => {
      set(state => {
        const listeners = { ...state.listeners }
        listeners[messageType] = listeners[messageType].filter(
          cb => cb !== callback
        )
        return { listeners }
      })
    }
  }
}))

export const useSetWsStatus = (): Action['setStatus'] =>
  useWebsocketStore(state => state.setStatus)
export const useSendWsMessage = (): Action['sendMessage'] =>
  useWebsocketStore(state => state.sendMessage)
export const useConnectWs = (): Action['connect'] =>
  useWebsocketStore(state => state.connect)
export const useWsSubscribe = (): Action['subscribe'] =>
  useWebsocketStore(state => state.subscribe)
export const useWsStatus = (): State['status'] =>
  useWebsocketStore(state => state.status)
