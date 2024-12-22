import { type FC, type PropsWithChildren, useEffect } from 'react'

import { useWebsocket } from './useWebsocket'

export const WsLayout: FC<PropsWithChildren> = ({ children }) => {
  const setWs = useWebsocket(state => state.setWs)

  useEffect(() => {
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
  }, [setWs])

  return <>{children}</>
}
