import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { base, icon, isLink, mode, size } from './styles'
import type { BtnMode, BtnSize } from './types.ts'

interface IBaseProps {
  isActive?: boolean
  icon?: boolean
  size?: BtnSize
  mode?: BtnMode
}

export const Button = styled.button<IBaseProps>`
  ${base}
  ${props => size[props.size ?? 'lg']}
    ${props => mode[props.mode ?? 'primary']}
    ${props => props.icon && icon}
    ${props => (props.as === 'a' || props.as === Link ? isLink : undefined)}
`
