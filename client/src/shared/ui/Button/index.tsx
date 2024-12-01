import {
  memo,
  type ButtonHTMLAttributes,
  type FC,
  type ReactElement
} from 'react'
import styled from 'styled-components'

import { base, size, mode, icon } from './styles'
import type { BtnMode, BtnSize } from './types.ts'

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  icon?: boolean
  size?: BtnSize
  mode?: BtnMode
  children: ReactElement | string
}

interface IStyledProps extends Omit<IProps, 'isActive' | 'icon'> {
  $isActive?: boolean
  $icon?: boolean
}

const ButtonWrapper = styled.button<IStyledProps>`
  ${base}
  ${props => props.size && size[props.size]}
  ${props => props.mode && mode[props.mode]}
  ${props => props.$icon && icon}
`

export const Button: FC<IProps> = memo(props => {
  const {
    isActive,
    icon,
    size = 'lg',
    mode = 'primary',
    type = 'button',
    ...rest
  } = props

  return (
    <ButtonWrapper
      $isActive={isActive}
      $icon={icon}
      type={type}
      mode={mode}
      size={size}
      {...rest}
    />
  )
})
