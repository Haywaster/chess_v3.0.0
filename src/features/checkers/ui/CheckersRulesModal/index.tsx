import { type FC } from 'react'
import styled from 'styled-components'

import { Modal } from 'shared/ui/Modal'
import { Switch } from 'shared/ui/Switch'

import { ruleTitles } from '../../const'
import { type Rules, useCheckers } from '../../model'

const Container = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 8px;
  flex-direction: column;
`

export const CheckersRulesModal: FC = () => {
  const rules = useCheckers(state => state.rules)
  const rulesModal = useCheckers(state => state.rulesModal)
  const toggleRulesModal = useCheckers(state => state.toggleRulesModal)
  const changeRule = useCheckers(state => state.changeRule)

  return (
    <Modal isOpen={rulesModal} onClose={toggleRulesModal}>
      <h3 className="title">Checkers rules</h3>
      <Container>
        {Object.entries(rules).map(([key, value]) => (
          <Switch
            key={key}
            id={key}
            initialChecked={value}
            onChange={value => changeRule(key as Rules, value.checked)}
            label={ruleTitles[key as Rules]}
          />
        ))}
      </Container>
    </Modal>
  )
}
