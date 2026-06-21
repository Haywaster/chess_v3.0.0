import { type FC } from 'react'
import styled from 'styled-components'

import { useOnline, useUsername } from 'features/auth'
import { Flex } from 'shared/ui'

import { ChooseGame } from '../ChooseGame'

const Container = styled(Flex)`
  margin-top: 30px;
`

const Title = styled.h1`
  text-align: center;
`

const offlineTitle = 'Hello! Play offline game!'

export const ChooseGameWithTitle: FC = () => {
  const username = useUsername()
  const online = useOnline()

  const title = !username
    ? 'Hello! Select your desired game'
    : `Welcome, ${username}! Choose the game!`

  return (
    <Container as="main" direction="column">
      <Title>{online ? title : offlineTitle}</Title>
      <ChooseGame />
    </Container>
  )
}
