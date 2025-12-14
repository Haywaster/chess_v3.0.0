import { type FC } from 'react'

import { ChooseGameWithTitle } from 'widgets/ChooseGame'
import { Header } from 'widgets/Header'

export const Main: FC = () => {
  return (
    <>
      <Header />
      <ChooseGameWithTitle />
    </>
  )
}
