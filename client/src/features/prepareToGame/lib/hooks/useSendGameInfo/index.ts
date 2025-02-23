import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useGame } from 'entities/Game/model/store/useGame.ts'
import { useWebsocket } from 'shared/api'

export const useSendGameInfo = (): void => {
  const { pathname } = useLocation()
  const ws = useWebsocket(state => state.ws)
  const username = useGame(state => state.username)

  useEffect(() => {
    if (ws && username && pathname) {
      ws.send(JSON.stringify({ pathname, username }))
    }
  }, [pathname, username, ws])
}
