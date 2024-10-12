import { type FC } from 'react'
import { Header } from 'widgets/Header'
import { Board } from 'widgets/Board/ui/Board'
import styled from 'styled-components'

const CenteredBoard = styled(Board)`
  margin: 0 auto;
`

export const Main: FC = () => {
  return (
    <>
      <Header />
      <main>
        <CenteredBoard />
      </main>
    </>
  )
}
