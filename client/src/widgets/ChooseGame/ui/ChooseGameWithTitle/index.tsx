import { type FC, useRef, useState } from 'react'
import styled from 'styled-components'

import { useUsername } from 'entities/User'
import { userService } from 'entities/User/service'
import { Button, Flex } from 'shared/ui'

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
  const username = useUsername()

  const [hasUnderline, setHasUnderline] = useState(false)
  const writeRef = useRef<HTMLSpanElement | null>(null)

  const underline = (): void => {
    if (writeRef.current && !hasUnderline) {
      setHasUnderline(true)

      setTimeout(() => {
        setHasUnderline(false)
      }, ANIMATION_DURATION)
    }
  }

  const title = !username ? (
    <>
      Hello!{' '}
      <Span ref={writeRef} $hasUnderline={hasUnderline}>
        Enter your user data
      </Span>{' '}
      to play
    </>
  ) : (
    <>Welcome, {username}! Choose the game!</>
  )

  return (
    <Container as="main" direction="column">
      <Title>{title}</Title>
      <Button onClick={() => userService.getUsers()}>Qwewq</Button>
      <ChooseGame onError={underline} />
    </Container>
  )
}
