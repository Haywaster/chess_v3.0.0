import { memo, type FC } from 'react'
import styled from 'styled-components'

import type { IFigure } from '../model'

interface IFigureWrapper extends Pick<IFigure, 'color'> {
  $isActive?: boolean
}

const FigureWrapper = styled.div<IFigureWrapper>`
  aspect-ratio: 1;
  width: 60%;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${p =>
    p.color === 'white' ? 'var(--white-figure)' : 'var(--black-figure)'};
  outline: ${p => p.$isActive && '3px solid var(--red)'};
  transition: outline 0.2s ease;
`

interface IProps extends IFigure {
  activeFigure: IFigure['id'] | null
  onFigureClick: (id: IFigure['id']) => void
}

export const Figure: FC<IProps> = memo(props => {
  const { color, id, activeFigure, onFigureClick } = props

  const handleClick = (): void => {
    onFigureClick(id)
  }

  return (
    <FigureWrapper
      color={color}
      $isActive={activeFigure === id}
      onClick={handleClick}
    />
  )
})
