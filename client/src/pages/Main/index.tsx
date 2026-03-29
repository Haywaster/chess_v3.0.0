import { type FC } from 'react'

import { ChooseGameWithTitle } from 'widgets/ChooseGame'
import { MainHeader } from 'widgets/Header'

export const Main: FC = () => {
  return (
    <>
      <MainHeader />
      <ChooseGameWithTitle />
    </>
  )
}
