import { type FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { GameMode, GameStatus } from 'entities/Game'
import { useUsername } from 'entities/User'
import { LogoutButton } from 'features/auth/logout'
import { useCheckersStore } from 'features/checkers'
import { RotateBoardBtn } from 'features/rotateBoard'
import { SwitchButton } from 'features/switchTheme'
import { RouterPath } from 'shared/const/router.ts'
import { Button, Flex } from 'shared/ui'

const StyledHeader = styled(Flex)`
  padding: 10px;
  background-color: var(--header-bg);
  border-radius: 10px;
`

const CheckersHeader: FC = () => {
  const stepColor = useCheckersStore(state => state.stepColor)
  const status = useCheckersStore(state => state.cooperativeGameData?.status)
  const mode = useCheckersStore(state => state.mode)

  const isLoading = status === GameStatus.PENDING && mode === GameMode.COUPLE

  return (
    <>
      <Flex size="xs">
        <SwitchButton />
        <p>{isLoading ? 'Loading...' : stepColor}</p>
        <Button as={Link} size="sm" to={RouterPath.HOME}>
          Back to games
        </Button>
      </Flex>
      <Flex size="xs">
        <RotateBoardBtn />
      </Flex>
    </>
  )
}

const MainHeader: FC = () => {
  const username = useUsername()

  return (
    <>
      <SwitchButton />
      <h2>Haywaster's games</h2>
      {username && <LogoutButton />}
    </>
  )
}

export const Header: FC = () => {
  const location = useLocation()

  const currentHeader = (() => {
    switch (location.pathname) {
      case RouterPath.HOME:
        return <MainHeader />
      case RouterPath.CHECKERS:
        return <CheckersHeader />
      default:
        return <CheckersHeader />
    }
  })()

  return (
    <StyledHeader as="header" justify="space-between">
      {currentHeader}
    </StyledHeader>
  )
}
