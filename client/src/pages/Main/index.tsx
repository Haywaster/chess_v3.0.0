import { type FC } from 'react'
import styled from 'styled-components'

import { Flex } from 'shared/ui/Flex'
import { ChooseGame } from 'widgets/ChooseGame'
import { Header } from 'widgets/Header'

const Container = styled(Flex)`
  margin-top: 30px;
`

const Title = styled.h1`
  text-align: center;
`

export const Main: FC = () => {
  return (
    <>
      <Header />
      <Container as='main' direction='column'>
        <Title>Hello! Write your name and chose the game</Title>
        <ChooseGame />
      </Container>
    </>
  )
}
