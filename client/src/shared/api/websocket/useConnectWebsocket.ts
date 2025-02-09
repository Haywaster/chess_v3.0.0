import { useInitialEffect } from 'shared/lib'

import { useWebsocket } from './useWebsocket'

export const useConnectWebsocket = (): void => {
  const setWs = useWebsocket(state => state.setWs)

  useInitialEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onopen = e => {
      if (e.target) {
        setWs(ws)
      }
    }

    ws.onclose = e => {
      if (e.target) {
        setWs(null)
      }
    }

    // ws.onmessage = event => {
    //   if (event.data) {
    //     console.log(event.data)
    //   }
    // }

    return () => {
      ws.close()
    }
  })
}
