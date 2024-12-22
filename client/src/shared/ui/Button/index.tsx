import {
  type ComponentProps,
  type FC,
  type JSX,
  memo,
  type PropsWithChildren,
  type ReactElement
} from 'react'
import { Link } from 'react-router-dom'
import styled, { type WebTarget } from 'styled-components'

import { base, icon, isLink, mode, size } from './styles'
import type { BtnMode, BtnSize } from './types.ts'

interface IBaseProps extends PropsWithChildren {
  isActive?: boolean
  icon?: boolean
  size?: BtnSize
  mode?: BtnMode
}

type IStyledProps = Omit<IBaseProps, 'isActive' | 'icon' | 'mode'> & {
  $isActive?: boolean
  $icon?: boolean
  $mode?: BtnMode
  $isLink?: boolean
}

type ButtonRoots =
  | Extract<keyof JSX.IntrinsicElements, 'button' | 'a'>
  | typeof Link
type RemoveDuplicatedProps<ComponentProps, PassedProps> = Omit<
  ComponentProps,
  keyof PassedProps
>

type GetPropsWithOverride<Root extends ButtonRoots, Props> = {
  as?: Root
} & Props &
  RemoveDuplicatedProps<ComponentProps<Root>, Props>

interface BaseButton<Props> {
  <Root extends ButtonRoots = 'button'>(
    props: GetPropsWithOverride<Root, Props>
  ): ReactElement
}

const createComponent = (element: WebTarget): FC<IStyledProps> => styled(
  element
)<IStyledProps>`
  ${base}
  ${props => props.size && size[props.size]}
    ${props => props.$mode && mode[props.$mode]}
    ${props => props.$icon && icon}
    ${props => props.$isLink && isLink}
`

const BtnComponent = createComponent('button')
const AComponent = createComponent('a')
const LinkComponent = createComponent(Link)

const Component: FC<IStyledProps & { as: ButtonRoots }> = memo(props => {
  const { as, ...rest } = props

  switch (as) {
    case 'button':
      return <BtnComponent {...rest} />
    case 'a':
      return <AComponent {...rest} />
    case Link:
      return <LinkComponent {...rest} />
    default:
      return <BtnComponent {...rest} />
  }
})

const ButtonComponent: BaseButton<IBaseProps> = props => {
  const {
    isActive,
    icon,
    size = 'lg',
    mode = 'primary',
    as = 'button',
    children,
    ...rest
  } = props

  const isLink = as !== 'button'
  const newProps: Omit<IStyledProps, 'children'> = {
    $isActive: isActive,
    $icon: icon,
    size,
    $mode: mode,
    $isLink: isLink
  }

  return (
    <Component as={as} {...newProps} {...rest}>
      {isLink ? <span>{children}</span> : children}
    </Component>
  )
}

export const Button = memo(ButtonComponent) as BaseButton<IBaseProps>
