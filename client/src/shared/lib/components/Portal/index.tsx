import { createPortal } from 'react-dom'

import type { FC, ReactNode } from 'react'

interface IProps {
  children: ReactNode
  target?: HTMLElement
}

export const Portal: FC<IProps> = ({ children, target }) => {
  const defaultTarget = target || document.body
  return createPortal(children, defaultTarget)
}
