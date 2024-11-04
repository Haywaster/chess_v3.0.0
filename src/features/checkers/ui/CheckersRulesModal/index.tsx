import { type FC } from 'react'

import { Modal } from 'shared/ui/Modal'
import { Switch } from 'shared/ui/Switch'

import { useCheckers } from '../../model'

export const CheckersRulesModal: FC = () => {
  const rulesModal = useCheckers(state => state.rulesModal)
  const toggleRulesModal = useCheckers(state => state.toggleRulesModal)

  return (
    <Modal isOpen={rulesModal} onClose={toggleRulesModal}>
      <h3>Checkers rules</h3>
      <Switch id="1" onChange={() => {}} label="123321" />
    </Modal>
  )
}
