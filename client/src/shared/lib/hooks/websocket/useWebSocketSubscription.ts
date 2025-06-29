import { useEffect, useRef } from 'react'

import { type WSServerResponse, useWebsocketStore } from 'shared/store/useWebsocketStore.ts'

export const useWebSocketSubscription = <T extends WSServerResponse>(
  messageType: string,
  callback: (message: T) => void,
  dependencies: unknown[] = []
): void => {
  const { subscribe } = useWebsocketStore();
  const callbackRef = useRef(callback);
// Обновляем ref при изменении callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    return subscribe(
      messageType,
      (message) => callbackRef.current(message as T),
    );
  }, [messageType, subscribe, ...dependencies]);
};