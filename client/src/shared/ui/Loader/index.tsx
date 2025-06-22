import { type FC, memo } from 'react'
import styled from 'styled-components'

import { Portal } from 'shared/lib'

interface LoaderProps {
  fullScreen?: boolean
  backgroundColor?: string
  loaderColor?: string
  size?: number
}

const DEFAULT_WIDTH_SPINNER = 40

const LoaderContainer = styled.div<
  Pick<LoaderProps, 'fullScreen' | 'backgroundColor'>
>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ backgroundColor }) =>
    backgroundColor || 'color-mix(in sRGB, var(--white) 70%, transparent)'};
  position: ${({ fullScreen }) => (fullScreen ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  width: ${({ fullScreen }) => (fullScreen ? '100vw' : '100%')};
  height: ${({ fullScreen }) => (fullScreen ? '100vh' : '100%')};
  z-index: 9999;
`

const LoaderSpinner = styled.div<{ loaderColor?: string; size?: number }>`
  width: ${({ size }) => size || DEFAULT_WIDTH_SPINNER}px;
  aspect-ratio: 1;
  border: 4px solid
    ${({ loaderColor }) => loaderColor || `var(--primary-color)`};
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const Loader: FC<LoaderProps> = memo(
  ({ fullScreen = false, backgroundColor, loaderColor, size }) => {
    const component = (
      <LoaderContainer {...{ backgroundColor, fullScreen }}>
        <LoaderSpinner {...{ loaderColor, size }} />
      </LoaderContainer>
    )

    return fullScreen ? <Portal>{component}</Portal> : component
  }
)
