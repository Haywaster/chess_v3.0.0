export type Size = 'lg' | 'sm' | 'xs'
export interface WebsocketDataConstructor<
  T = string,
  D = Record<string, unknown>
> {
  type: T
  data: D
}
export type MessageListener = <T, D>(
  message: WebsocketDataConstructor<T, D>
) => void
export type EnumValues<T extends Record<string, string | number>> = T[keyof T]
