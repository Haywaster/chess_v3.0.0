import { memo, type FC } from 'react'
import styled from 'styled-components'

import { CheckersRulesBtn } from 'features/checkers'
import { RotateBoardBtn } from 'features/rotateBoard'
import { SwitchButton } from 'features/switchTheme'

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: 10px;
  background-color: var(--header-bg);
  border-radius: 10px;
`

const BtnsWrapper = styled.div`
  display: flex;
  gap: 10px;
`

export const Header: FC = memo(() => {
  return (
    <StyledHeader>
      <BtnsWrapper>
        <SwitchButton />
        <CheckersRulesBtn />
      </BtnsWrapper>
      <BtnsWrapper>
        <RotateBoardBtn />
      </BtnsWrapper>
    </StyledHeader>
  )
})
