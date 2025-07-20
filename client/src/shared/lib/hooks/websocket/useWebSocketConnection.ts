import { useEffect } from 'react'

import { useConnectWs, useWsStatus } from 'shared/store'

export const useWebSocketConnection = (url: string): void => {
  const status = useWsStatus()
  const connect = useConnectWs()

  useEffect(() => {
    if (status === WebSocket.CLOSED) {
      connect(url)
    }
  }, [connect, status, url])
}
