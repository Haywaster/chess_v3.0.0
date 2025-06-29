import { useEffect } from 'react'
import { useWebsocketStore } from 'shared/store'
import { WebSocketStatus } from 'shared/store/useWebsocketStore.ts'

interface UseWebSocketConnection {
  connectionState: WebSocketStatus
  isConnected: boolean
  isConnecting: boolean
}

export const useWebSocketConnection = (url: string): UseWebSocketConnection => {
  const { connect, connectionState } = useWebsocketStore();
  
  useEffect(() => {
    if (connectionState === WebSocket.CLOSED) {
      connect(url);
    }
  }, [connect, connectionState, url]);
  
  return {
    connectionState,
    isConnected: connectionState === WebSocketStatus.OPEN,
    isConnecting: connectionState === WebSocketStatus.CONNECTING
  };
};
