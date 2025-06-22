export type Size = 'lg' | 'sm' | 'xs'
export interface WebsocketDataConstructor<T extends string, D> {
  type: T
  data: D
}
