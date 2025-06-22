import { type WebsocketDataConstructor } from 'shared/types'

interface AuthRequestData {
  username: string
}

export type AuthRequestWebsocket = WebsocketDataConstructor<
  'auth',
  AuthRequestData
>
