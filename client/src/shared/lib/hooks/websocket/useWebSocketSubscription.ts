import { useEffect } from 'react'

import { useWsSubscribe } from 'shared/store/useWebsocketStore'
import { type WebsocketDataConstructor } from 'shared/types'

// Работает с response WebSocket (обязательно <...Response...> в типизации)
// Установит подписку при монтаже компонента
export const useWebSocketSubscription = <
  T extends WebsocketDataConstructor<
    T['type'],
    T['data']
  > = WebsocketDataConstructor
>(
  messageType: T['type'],
  callback: (message: T) => void
): void => {
  const subscribe = useWsSubscribe()
  console.log(messageType)
  useEffect(() => {
    return subscribe(messageType as string, message => callback(message as T))
  }, [callback, messageType, subscribe])
}
