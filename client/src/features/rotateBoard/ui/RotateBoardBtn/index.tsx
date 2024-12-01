import { type ComponentProps, type FC } from 'react'
import styled, { css } from 'styled-components'

import { Button } from 'shared/ui/Button'

import { ArrowCircle } from '../../assets'
import { useRotateBoard } from '../../model'

interface IStyledButtonProps extends ComponentProps<typeof Button> {
  $isRotate: boolean
}

const StyledButton = styled(Button)<IStyledButtonProps>`
  color: var(--white);

  & > svg {
    transition: all 0.3s ease;
  }

  ${p =>
    p.$isRotate &&
    css`
      background-color: var(--primary-active-color);

      & > svg {
        scale: 1.3;
        rotate: 180deg;
      }
    `}
`

export const RotateBoardBtn: FC = () => {
  const rotate = useRotateBoard(state => state.rotate)
  const toggleRotate = useRotateBoard(state => state.toggleRotate)

  return (
    <StyledButton
      className="svgColor"
      icon
      onClick={toggleRotate}
      $isRotate={rotate}
    >
      <ArrowCircle />
    </StyledButton>
  )
}
