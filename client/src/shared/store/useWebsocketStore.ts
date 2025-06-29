/* eslint-disable no-console */
/* eslint-disable max-lines */
import { create } from 'zustand'
// import { subscribeWithSelector } from 'zustand/middleware'

type ISubscribe = Record<string, any>

export interface WSServerResponse {
  type: string
  data: Record<string, any>
}

type MessageListener = (message: WSServerResponse) => void

export enum WebSocketStatus {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}


export interface WSServerSubscribe {
  action: 'subscribe'
  subscriptions: Record<string, unknown>[]
}

export interface WSServerUnsubscribe {
  action: 'unsubscribe'
  subscriptions: Record<string, unknown>[]
}

interface State {
  socketRef: WebSocket | null
  reconnectTimeoutRef: number | null
  messageListenersRef: Record<string, MessageListener[]>,
  connectionState: WebSocketStatus,
  subscriptions: Record<string, ISubscribe>,
  lastMessage: WSServerResponse | null
}

interface Action {
  setConnectionState: (WebSocketStatus: WebSocketStatus) => void
  updateLastMessage: (message: WSServerResponse) => void
  sendMessage: (message: WSServerResponse | ISubscribe) => void
  connect: (url: string) => void
  subscribe: (messageType: string, callback: MessageListener) => void
  addSubscription: (subscriptionData: ISubscribe) => string
  removeSubscription: (subscriptionId: string) => void
}

const initialState: State = {
  socketRef: null,
  reconnectTimeoutRef: null,
  messageListenersRef: {},
  connectionState: WebSocketStatus.CLOSED,
  subscriptions: {},
  lastMessage: null
};


export const useWebsocketStore = create<State & Action>((set, get) => ({
  ...initialState,
  setConnectionState: connectionState => set({ connectionState }),
  updateLastMessage: message => set({ lastMessage: message }),
  sendMessage: message => {
    const state = get();
    
    if (state.socketRef?.readyState === WebSocket.OPEN) {
      state.socketRef.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket не подключен');
    }
  },
  connect: (url: string) => {
    const state = get();
    
    if (state.socketRef?.readyState === WebSocket.OPEN) {
      return;
    }
    
    state.setConnectionState(WebSocketStatus.CONNECTING)
    state.socketRef = new WebSocket(url);
    state.socketRef.onopen = () => {
      state.setConnectionState(WebSocketStatus.OPEN);
      console.log('WebSocket connected');
      
      // Восстанавливаем подписки после переподключения
      Object.values(state.subscriptions).forEach(subscription => {
        state.sendMessage({
          action: 'subscribe',
          ...subscription
        });
      });
    };
    state.socketRef.onmessage = (event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data) as WSServerResponse;
        state.updateLastMessage(message)
        
        // Маршрутизация сообщений по типам
        if (message.type in state.messageListenersRef.current) {
          state.messageListenersRef[message.type].forEach(callback => callback(message));
        }
      } catch (error) {
        console.error('Ошибка парсинга WebSocket сообщения:', error);
      }
    };
    state.socketRef.onclose = () => {
      state.setConnectionState(WebSocketStatus.CLOSED);
      console.log('WebSocket disconnected');
      
      // Автоматическое переподключение с экспоненциальной задержкой
      state.reconnectTimeoutRef = setTimeout(() => {
        state.connect(url);
      }, Math.min(1000 * Math.pow(2, Math.random() * 3), 10000));
    };
    state.socketRef.onerror = (error) => {
      console.error('WebSocket error:', error);
      state.setConnectionState(WebSocketStatus.CLOSED);
    };
  },
  subscribe: (messageType: string, callback: MessageListener) => {
    const state = get();
    
    if (!(messageType in state.messageListenersRef)) {
      state.messageListenersRef[messageType] = [];
    }
    state.messageListenersRef[messageType].push(callback);
    
    // Возвращаем функцию отписки
    return () => {
      state.messageListenersRef[messageType] =
        state.messageListenersRef[messageType].filter(cb => cb !== callback);
    };
  },
  addSubscription: (subscriptionData: ISubscribe) => {
    const state = get();
    const subscriptionId = `${subscriptionData.type}_${Date.now()}`;
    set({
      subscriptions: { ...state.subscriptions, [subscriptionId]: subscriptionData }
    })
    state.sendMessage({
      action: 'subscribe',
      ...subscriptionData
    });
    
    return subscriptionId;
  },
  removeSubscription: subscriptionId => set(state => {
    if (subscriptionId in state.subscriptions) {
      const subscriptions = { ...state.subscriptions };
      delete subscriptions[subscriptionId];
      return { subscriptions };
    }
    
    return state
  }),
}))
