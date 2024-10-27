import { memo, type FC, type CSSProperties } from 'react'
import styled from 'styled-components'

import Crown from '../assets/crown.svg?react'
import type { IFigure } from '../model'

interface IFigureWrapper extends Pick<IFigure, 'color'> {
  $isActive?: boolean
  $isKilling?: boolean
  $isStain?: boolean
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
  opacity: ${p => (p.$isKilling ? 0 : 1)};
  color: ${p => (p.color === 'white' ? 'var(--black)' : 'var(--yellow)')};
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg {
    width: 70%;
    height: auto;
    transform: scale(1, -1);
  }
`

interface IProps extends IFigure {
  activeFigure: IFigure['id'] | null
  onClick: (id: IFigure['id']) => void
  style?: CSSProperties
  isKilling?: boolean
}

export const Figure: FC<IProps> = memo(props => {
  const { color, id, activeFigure, onClick, style, isKilling, isStain } = props

  const handleClick = (): void => onClick(id)

  return (
    <FigureWrapper
      className="svgColor"
      color={color}
      $isActive={activeFigure === id}
      $isKilling={isKilling}
      onClick={handleClick}
      style={style}
    >
      {isStain && <Crown />}
    </FigureWrapper>
  )
})
