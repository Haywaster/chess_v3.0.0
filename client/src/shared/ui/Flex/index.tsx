import type { CSSProperties } from 'react'
import styled from 'styled-components'

import { type Size } from 'shared/types'

interface IProps {
  size?: Size | number
  direction?: CSSProperties['flexDirection']
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
}

const sizeConvert: Record<Size, string> = {
  lg: '24px',
  sm: '16px',
  xs: '8px'
}

export const Flex = styled.div.withConfig({
  shouldForwardProp: prop =>
    !['size', 'direction', 'align', 'justify'].includes(prop)
})<IProps>`
  display: flex;
  gap: ${({ size = 'sm' }) =>
    typeof size === 'string' ? sizeConvert[size] : `${size}px`};
  flex-direction: ${({ direction }) => direction};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
`
