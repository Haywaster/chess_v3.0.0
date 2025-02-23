import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { type Size } from 'shared/types'

import { base, icon, isLink, mode, size } from './styles'
import type { BtnMode } from './types.ts'

interface IBaseProps {
  isActive?: boolean
  icon?: boolean
  size?: Size
  mode?: BtnMode
}

export const Button = styled.button
  .withConfig({
    shouldForwardProp: prop =>
      !['isActive', 'icon', 'size', 'mode'].includes(prop)
  })
  .attrs<IBaseProps>(props => ({
    type: props.type ?? 'button',
    role: props.role ?? 'button'
  }))`
    ${base}
    ${props => size[props.size ?? 'lg']}
    ${props => mode[props.mode ?? 'primary']}
    ${props => props.icon && icon}
    ${props => (props.as === 'a' || props.as === Link ? isLink : undefined)}
`
