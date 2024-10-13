import { memo, type FC, type CSSProperties } from 'react'
import styled from 'styled-components'

import type { IFigure } from '../model'

interface IFigureWrapper extends Pick<IFigure, 'color'> {
  $isActive?: boolean
}

const FigureWrapper = styled.div<IFigureWrapper>`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  aspect-ratio: 1;
  width: 60%;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${p =>
    p.color === 'white' ? 'var(--white-figure)' : 'var(--black-figure)'};
  outline: ${p => p.$isActive && '3px solid var(--red)'};
  transition: all 0.2s ease;
`

interface IProps extends IFigure {
  activeFigure: IFigure['id'] | null
  onClick: (id: IFigure['id']) => void
  style?: CSSProperties
}

export const Figure: FC<IProps> = memo(props => {
  const { color, id, activeFigure, onClick, style } = props

  const handleClick = (): void => onClick(id)

  return (
    <FigureWrapper
      color={color}
      $isActive={activeFigure === id}
      onClick={handleClick}
      style={style}
    />
  )
})
