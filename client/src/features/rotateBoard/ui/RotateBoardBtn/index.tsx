import { type ComponentProps, type FC } from 'react'
import styled, { css } from 'styled-components'

import { useRotate, useToggleRotate } from 'shared/store'
import { Button } from 'shared/ui/Button'

import { ArrowCircle } from '../../assets'

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
  const rotate = useRotate()
  const toggleRotate = useToggleRotate()

  return (
    <StyledButton
      icon
      $isRotate={rotate}
      className="svgColor"
      size="sm"
      onClick={toggleRotate}
    >
      <ArrowCircle />
    </StyledButton>
  )
}
