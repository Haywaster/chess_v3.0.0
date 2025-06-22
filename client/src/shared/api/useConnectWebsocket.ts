import { useInitialEffect } from 'shared/lib'
import { useWs, useSetWs } from 'shared/store'

const WEBSOCKET_SERVER = 'ws://localhost:8080'

// Вызывается один раз на всех страницах для установки соединения
export const useConnectWebsocket = (): void => {
  const ws = useWs()
  const setWs = useSetWs()

  useInitialEffect(() => {
    const websocket = new WebSocket(WEBSOCKET_SERVER)

    if (!ws) {
      websocket.onopen = () => setWs(websocket)
      websocket.onclose = () => setWs(null)
    }
  })
}
