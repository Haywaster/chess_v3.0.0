import type { FC, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface IProps {
  children: ReactNode
  target?: HTMLElement
}

export const Portal: FC<IProps> = ({ children, target }) => {
  const defaultTarget = target || document.body
  return createPortal(children, defaultTarget)
}
