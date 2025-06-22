import { useEffect } from 'react'

import { useWs } from 'shared/store'

import { useGameInfo } from '../useGameInfo'

export const useSendGameInfo = (): void => {
  const ws = useWs()
  const gameInfo = useGameInfo()

  useEffect(() => {
    if (gameInfo && ws) {
      ws.send(JSON.stringify(gameInfo))
    }
  }, [gameInfo, ws])
}
