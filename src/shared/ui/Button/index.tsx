import classNames from 'classnames'
import {
  memo,
  type ButtonHTMLAttributes,
  type FC,
  type ReactElement
} from 'react'

import module from './Button.module.scss'

type BtnSize = 'lg' | 'sm' | 'xs'
type BtnMode = 'primary' | 'secondary' | 'outline' | 'ghost'

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  icon?: boolean
  size?: BtnSize
  mode?: BtnMode
  children: ReactElement | string
}

export const Button: FC<IProps> = memo(props => {
  const {
    icon,
    children,
    isActive,
    size = 'lg',
    mode = 'primary',
    className,
    type = 'button',
    ...rest
  } = props

  const clazz = classNames(
    module.button,
    { [module.icon]: icon, [module.active]: isActive },
    [module[size], module[mode], className]
  )

  return (
    <button type={type} className={clazz} {...rest}>
      {children}
    </button>
  )
})
