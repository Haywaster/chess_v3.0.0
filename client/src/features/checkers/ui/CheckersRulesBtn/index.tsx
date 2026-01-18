import { type FC } from 'react'

import { Button } from 'shared/ui/Button'

import { useCheckersStore } from '../../store'

export const CheckersRulesBtn: FC = () => {
  const toggleRulesModal = useCheckersStore(state => state.toggleRulesModal)

  return (
    <Button size="sm" onClick={toggleRulesModal}>
      Rules
    </Button>
  )
}
