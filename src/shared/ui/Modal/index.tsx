import type { FC, ReactNode, MouseEvent } from 'react'
import { useState, useEffect, useCallback, memo } from 'react'

import { Portal } from '../../lib'

import module from './Modal.module.scss'
import classNames from 'classnames'

interface IProps {
  isOpen: boolean
  onClose?: () => void
  children: ReactNode
  lazy?: boolean
  className?: string
}

export const Modal: FC<IProps> = memo(props => {
  const { children, onClose, isOpen, lazy, className } = props
  const [isMounted, setIsMounted] = useState(false)

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      window.addEventListener('keydown', onKeyDown)
      document.documentElement.style.overflowY = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.documentElement.removeAttribute('style')
    }
  }, [isOpen, onKeyDown])

  const onContentClick = (e: MouseEvent): void => {
    e.stopPropagation()
  }

  const mods = {
    [module.open]: isOpen
  }

  if (lazy && !isMounted) {
    return null
  }

  return (
    <Portal>
      <div className={classNames(module.modal, mods)}>
        <div onClick={onClose} className={module.overlay}>
          <div
            onClick={onContentClick}
            className={classNames(module.content, className)}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  )
})
