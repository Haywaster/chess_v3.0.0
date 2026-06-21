import classNames from 'classnames'
import {
  memo,
  useEffect,
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ComponentProps,
  type PointerEvent,
  useRef
} from 'react'

import { Portal } from '../../lib'

import module from './Modal.module.scss'

interface IProps extends PropsWithChildren {
  isOpen: boolean
  onClose?: () => void
  destroyOnClose?: boolean
  className?: string
  width?: number
}

export const Modal: FC<IProps> = memo(props => {
  const { children, onClose, isOpen, destroyOnClose, width, className } = props

  const overlayPressed = useRef(false)
  const mouseInContent = useRef(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.documentElement.style.overflowY = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.documentElement.removeAttribute('style')
    }
  }, [onClose])

  const onOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (
      overlayPressed.current &&
      !mouseInContent.current &&
      e.target === e.currentTarget
    ) {
      onClose?.()
    }

    overlayPressed.current = false
    mouseInContent.current = false
  }

  const onOverlayPointerDown = (e: PointerEvent): void => {
    overlayPressed.current = e.target === e.currentTarget
  }

  const onContentPointerEnter = (): void => {
    mouseInContent.current = true
  }
  const onContentPointerLeave = (): void => {
    mouseInContent.current = false
  }

  const mods = {
    [module.open]: isOpen
  }

  if (destroyOnClose && !isOpen) {
    return null
  }

  return (
    <Portal>
      <div className={classNames(module.modal, mods)}>
        <div
          className={module.overlay}
          onClick={onOverlayClick}
          onPointerDown={onOverlayPointerDown}
        >
          <div
            className={classNames(module.content, className)}
            style={{ width }}
            onPointerEnter={onContentPointerEnter}
            onPointerLeave={onContentPointerLeave}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  )
})

export type ModalProps = ComponentProps<typeof Modal>
