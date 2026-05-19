import { Link } from 'react-router'

import { GameMode, GameStatus } from 'entities/Game'
import { useCheckersStore } from 'features/checkers'
import { RotateBoardBtn } from 'features/rotateBoard'
import { SwitchButton } from 'features/switchTheme'
import { RouterPath } from 'shared/const/router.ts'
import { Button, Flex } from 'shared/ui'

import { HeaderWrapper } from './HeaderWrapper'

import type { FC } from 'react'

export const CheckersHeader: FC = () => {
  const stepColor = useCheckersStore(state => state.stepColor)
  const status = useCheckersStore(state => state.status)
  const mode = useCheckersStore(state => state.mode)

  const isLoading = status === GameStatus.PENDING && mode === GameMode.COUPLE

  return (
    <HeaderWrapper>
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
    </HeaderWrapper>
  )
}
