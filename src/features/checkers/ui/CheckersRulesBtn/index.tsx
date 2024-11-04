import { type FC } from 'react'

import { Button } from 'shared/ui/Button'

import { useCheckers } from '../../model'

export const CheckersRulesBtn: FC = () => {
  const toggleRulesModal = useCheckers(state => state.toggleRulesModal)

  return (
    <Button size="sm" onClick={toggleRulesModal}>
      Rules
    </Button>
  )
}
