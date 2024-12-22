import { memo, type FC } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { CheckersRulesBtn } from 'features/checkers'
import { RotateBoardBtn } from 'features/rotateBoard'
import { SwitchButton } from 'features/switchTheme'
import { RouterPath } from 'shared/const/router'

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: var(--header-bg);
  border-radius: 10px;
`

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
`

const CheckersHeader: FC = memo(() => {
  return (
    <>
      <ButtonsWrapper>
        <SwitchButton />
        <CheckersRulesBtn />
      </ButtonsWrapper>
      <ButtonsWrapper>
        <RotateBoardBtn />
      </ButtonsWrapper>
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

  return <StyledHeader>{currentHeader}</StyledHeader>
})
