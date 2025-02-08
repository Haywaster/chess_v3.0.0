import { type FC, useRef, useState } from 'react'
import styled from 'styled-components'

import { Flex } from 'shared/ui/Flex'

import { ChooseGame } from '../ChooseGame'

const Container = styled(Flex)`
  margin-top: 30px;
`

const Title = styled.h1`
  text-align: center;
`

const Span = styled.span<{ $hasUnderline: boolean }>`
  background-image: linear-gradient(var(--red) 0 0);
  background-position: ${({ $hasUnderline }) =>
    $hasUnderline ? 'bottom left' : 'bottom right'};
  background-size: var(--underline-width, 0%) 5px;
  background-repeat: no-repeat;

  text-decoration: none;
  transition: background-size 0.5s;

  --underline-width: ${({ $hasUnderline }) => ($hasUnderline ? '100%' : '0%')};
`

const ANIMATION_DURATION = 1000

export const ChooseGameWithTitle: FC = () => {
  const [hasUnderline, setHasUnderline] = useState(false)
  const writeRef = useRef<HTMLSpanElement | null>(null)

  const underline = (): void => {
    if (writeRef.current) {
      setHasUnderline(true)

      setTimeout(() => {
        setHasUnderline(false)
      }, ANIMATION_DURATION)
    }
  }

  return (
    <Container as="main" direction="column">
      <Title>
        Hello!{' '}
        <Span ref={writeRef} $hasUnderline={hasUnderline}>
          Write your name
        </Span>{' '}
        and chose the game
      </Title>
      <ChooseGame onError={underline} />
    </Container>
  )
}
