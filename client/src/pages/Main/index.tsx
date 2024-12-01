import { type FC, useEffect } from 'react'
import styled from 'styled-components'

import { CheckersRulesModal } from 'features/checkers'
import { Board } from 'widgets/Board'
import { Header } from 'widgets/Header'

const CenteredBoard = styled(Board)`
  margin: 0 auto;
`

const StyledMain = styled.main`
  margin-top: 30px;
  padding: 0 10px;
`


export const Main: FC = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onopen = () => {
      console.log('Соединение установлено');
      ws.send('Hello, server!');
    }
    
    ws.onclose = () => {
      console.log('Соединение закрыто');
    }
    
    ws.onmessage = (event) => {
      console.log(event.data);
    }
    
    return () => {
      ws.close();
    }
  }, [])
  
  return (
    <>
      <Header />
      <StyledMain>
        <CenteredBoard />
      </StyledMain>
      <CheckersRulesModal />
    </>
  )
}
