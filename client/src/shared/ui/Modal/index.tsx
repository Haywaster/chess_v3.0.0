import classNames from 'classnames'
import {
  memo,
  useEffect,
  useState,
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ComponentProps
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
  const [isMounted, setIsMounted] = useState(false)

  const [isMaskEnter, setIsMaskEnter] = useState(false)
  const [isMaskDown, setIsMaskDown] = useState(false)

  const [isContentEnter, setIsContentEnter] = useState(false)
  const [isContentDown, setIsContentDown] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', onKeyDown)
      document.documentElement.style.overflowY = 'hidden'
    }

    setIsMounted(isOpen)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.documentElement.removeAttribute('style')
    }
  }, [isOpen, onClose])

  const onContentClick = (e: MouseEvent): void => {
    e.stopPropagation()
  }

  const contentEnter = (): void => setIsContentEnter(true)
  const contentDown = (): void => {
    setIsContentDown(true)
  }
  const contentLeave = (): void => setIsContentEnter(false)
  const contentUp = (): number =>
    setTimeout(() => {
      if (isMaskDown) {
        setIsMaskDown(false)
      }
      setIsContentDown(false)
    })

  const maskEnter = (): void => setIsMaskEnter(true)
  const maskDown = (): void => setIsMaskDown(true)
  const maskLeave = (): void => setIsMaskEnter(false)
  const maskUp = (): number =>
    setTimeout(() => {
      if (isContentDown) {
        setIsContentDown(false)
      }
      setIsMaskDown(false)
    })

  // console.log(isMaskDown, isContentDown)
  const closeModalOnOverlay = (): void => {
    if (isMaskDown && isContentEnter) {
      return
    }

    if (isContentDown && isMaskEnter) {
      return
    }

    onClose?.()
  }

  const mods = {
    [module.open]: isOpen
  }

  if (destroyOnClose && !isMounted) {
    return null
  }

  return (
    <Portal>
      <div className={classNames(module.modal, mods)}>
        <div
          className={module.overlay}
          onClick={closeModalOnOverlay}
          onPointerDown={maskDown}
          onPointerEnter={maskEnter}
          onPointerLeave={maskLeave}
          onPointerUp={maskUp}
        >
          <div
            className={classNames(module.content, className)}
            style={{ width }}
            onClick={onContentClick}
            onPointerDown={contentDown}
            onPointerEnter={contentEnter}
            onPointerLeave={contentLeave}
            onPointerUp={contentUp}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  )
})

export type ModalProps = ComponentProps<typeof Modal>
