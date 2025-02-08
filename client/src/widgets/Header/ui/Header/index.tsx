import { memo, type FC } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { CheckersRulesBtn } from 'features/checkers'
import { RotateBoardBtn } from 'features/rotateBoard'
import { SwitchButton } from 'features/switchTheme'
import { RouterPath } from 'shared/const/router'
import { Flex } from 'shared/ui/Flex'

const StyledHeader = styled(Flex)`
  padding: 10px;
  background-color: var(--header-bg);
  border-radius: 10px;
`

const CheckersHeader: FC = memo(() => {
  return (
    <>
      <Flex size="xs">
        <SwitchButton />
        <CheckersRulesBtn />
      </Flex>
      <Flex size="xs">
        <RotateBoardBtn />
      </Flex>
    </>
  )
})

const MainHeader: FC = memo(() => {
  return (
    <>
      <SwitchButton />
      <h2>Haywaster's games</h2>
    </>
  )
})

export const Header: FC = memo(() => {
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
})
