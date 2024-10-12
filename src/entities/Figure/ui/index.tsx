import styled from 'styled-components'
import type { IFigure } from '../model'
import type { FC } from 'react'
import { memo } from 'react'
import { useCheckers } from 'features/checkers/model'

interface IFigureWrapper extends Pick<IFigure, 'color'> {
  isActive?: boolean
}

const FigureWrapper = styled.div<IFigureWrapper>`
  aspect-ratio: 1;
  width: 60%;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${p =>
    p.color === 'white' ? 'var(--white-figure)' : 'var(--black-figure)'};
  outline: ${p => p.isActive && '3px solid var(--red)'};
  transition: outline 0.2s ease;
`

export const Figure: FC<IFigure> = memo(props => {
  const { color, id } = props
  const activeFigure = useCheckers(state => state.activeFigure)
  const setActiveFigure = useCheckers(state => state.setActiveFigure)

  const handleClick = () => {
    if (activeFigure === props.id) {
      setActiveFigure(null)
    } else {
      setActiveFigure(props.id)
    }
  }

  return (
    <FigureWrapper
      color={color}
      isActive={activeFigure === id}
      onClick={handleClick}
    />
  )
})
