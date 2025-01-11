import { type ChangeEventHandler, type FC, useState } from 'react'
import styled from 'styled-components'

import { games } from 'pages/Main/const'
import { Input } from 'shared/ui/Input'
import { Header } from 'widgets/Header'
import { VideoLinks } from 'widgets/VideoLinks/ui/VideoLinks'

const StyledMain = styled.main`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Title = styled.h1`
  text-align: center;
`

export const Main: FC = () => {
  const [username, setUsername] = useState<string>('')

  const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = e => {
    setUsername(e.target.value)
  }

  return (
    <>
      <Header />
      <StyledMain>
        <Title>Hello! Write your name and chose the game</Title>
        <Input onChange={inputChangeHandler} />
        <VideoLinks games={games} inputText={username} />
      </StyledMain>
    </>
  )
}
