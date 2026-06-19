import { Link } from 'react-router'

import { RotateBoardBtn } from 'features/rotateBoard'
import { SwitchButton } from 'features/switchTheme'
import { RouterPath } from 'shared/const/router'
import { Button, Flex } from 'shared/ui'

import { HeaderWrapper } from './HeaderWrapper'

import type { FC } from 'react'

export const CheckersHeader: FC = () => {
  return (
    <HeaderWrapper>
      <Flex align="center" size="xs">
        <SwitchButton />
        <Button as={Link} size="sm" to={RouterPath.HOME}>
          Back to games
        </Button>
      </Flex>
      <Flex size="xs">
        <RotateBoardBtn />
      </Flex>
    </HeaderWrapper>
  )
}
