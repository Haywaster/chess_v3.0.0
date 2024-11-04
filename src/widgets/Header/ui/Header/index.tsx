import { memo, type FC } from 'react'
import styled from 'styled-components'

import { CheckersRulesBtn } from 'features/checkers'
import { SwitchButton } from 'features/switchTheme'

const StyledHeader = styled.header`
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
    </StyledHeader>
  )
})
