import { type ComponentProps, type FC, useCallback } from 'react'
import styled from 'styled-components'

import { Flex } from 'shared/ui/Flex'
import { Modal } from 'shared/ui/Modal'
import { Switch } from 'shared/ui/Switch'

import { type Rules, ruleTitles } from '../../model'
import { useCheckersStore } from '../../store'

const ModalStyled = styled(Modal)`
  color: var(--black);
`

const Container = styled(Flex)`
  margin-top: 15px;
`

export const CheckersRulesModal: FC = () => {
  const rules = useCheckersStore(state => state.rules)
  const rulesModal = useCheckersStore(state => state.rulesModal)
  const toggleRulesModal = useCheckersStore(state => state.toggleRulesModal)
  const changeRule = useCheckersStore(state => state.changeRule)

  const changeHandler: ComponentProps<typeof Switch>['onChange'] = useCallback(
    value => {
      changeRule(value.id as Rules, value.checked)
    },
    [changeRule]
  )

  return (
    <ModalStyled isOpen={rulesModal} onClose={toggleRulesModal}>
      <h3 className="title">Checkers rules</h3>
      <Container direction="column" size="xs">
        {Object.entries(rules).map(([key, value]) => (
          <Switch
            key={key}
            id={key}
            initialChecked={value}
            label={ruleTitles[key as Rules]}
            onChange={changeHandler}
          />
        ))}
      </Container>
    </ModalStyled>
  )
}
