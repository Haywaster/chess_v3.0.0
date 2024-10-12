import { type FC } from 'react'
import styled from 'styled-components'

import { Board } from 'widgets/Board'
import { Header } from 'widgets/Header'

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
