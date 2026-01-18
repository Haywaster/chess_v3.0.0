import type { ICell } from 'entities/Cell'
import type { IFigure } from 'entities/Figure'
import type { IGame } from 'entities/Game'
import type { WebsocketDataConstructor } from 'shared/types'

export interface IBoard {
  cells: Record<number, ICell>
  figures: Record<number, IFigure>
}

export interface IKillVariant {
  finishCellId: ICell['id']
  figure: IFigure['id']
}

export type Rules =
  | 'requireKill'
  | 'behindKill'
  | 'killMaxFigure'
  | 'stopAfterKill'

export interface IMoveFigure {
  startCell: ICell
  finishCell: ICell
}
export type MoveFigureRequestWebsocket = WebsocketDataConstructor<
  'MOVE_FIGURE',
  IMoveFigure & { gameId: IGame['id'] }
>
export type MoveFigureResponseWebsocket = WebsocketDataConstructor<
  'MOVE_FIGURE',
  IMoveFigure & { currentTurn: IFigure['color'] }
>
