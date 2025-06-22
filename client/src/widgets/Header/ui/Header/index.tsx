import { type FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { useUsername } from 'entities/User'
import { LogoutButton } from 'features/auth/logout'
import { CheckersRulesBtn } from 'features/checkers'
import { RotateBoardBtn } from 'features/rotateBoard'
import { SwitchButton } from 'features/switchTheme'
import { RouterPath } from 'shared/const/router'
import { Button, Flex } from 'shared/ui'

const StyledHeader = styled(Flex)`
  padding: 10px;
  background-color: var(--header-bg);
  border-radius: 10px;
`

const CheckersHeader: FC = () => {
  return (
    <>
      <Flex size="xs">
        <SwitchButton />
        <Button as={Link} size="sm" to={RouterPath.Home}>
          Back to games
        </Button>
      </Flex>
      <Flex size="xs">
        <CheckersRulesBtn />
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
      case RouterPath.Home:
        return <MainHeader />
      case RouterPath.Checkers:
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
