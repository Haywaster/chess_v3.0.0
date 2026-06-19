import { type ComponentProps, type FC, useCallback, useState } from 'react'
import styled from 'styled-components'

import type { IFigure } from 'entities/Figure'
import {
  GameMode,
  GameType,
  type ICreateGameData,
  type TGameMode
} from 'entities/Game'
import { Button, Flex, Switch } from 'shared/ui'
import type { ISwitchProps } from 'shared/ui/Switch'

import {
  ruleDefaults,
  ruleTitles,
  type TRules,
  initialBoard
} from '../../model'
import { useCheckersStore, useUpdateBoard } from '../../store'

const CenteredText = styled.p`
  text-align: center;
`

const Wrapper = styled(Flex)`
  margin-top: 16px;
`

interface IProps {
  createGame: (data: ICreateGameData) => void
  online: boolean
}

export const CheckersChooseRules: FC<IProps> = props => {
  const { createGame, online } = props

  const setGlobalMode = useCheckersStore(state => state.setMode)
  const setUserColor = useCheckersStore(state => state.setUserColor)
  const setGlobalRules = useCheckersStore(state => state.setRules)
  const updateBoard = useUpdateBoard()

  const [color, setColor] = useState<IFigure['color']>('white')
  const [onlineMode, setOnlineMode] = useState<Exclude<TGameMode, 'OFFLINE'>>(
    GameMode.SINGLE
  )
  const [rules, setRules] = useState<Record<TRules, boolean>>(ruleDefaults)

  const changeHandler: ComponentProps<typeof Switch>['onChange'] = useCallback(
    ({ id, checked }) => setRules(prev => ({ ...prev, [id]: checked })),
    []
  )

  const onChangeGameMode: ISwitchProps['onChange'] = ({ checked }) =>
    setOnlineMode(checked ? GameMode.COUPLE : GameMode.SINGLE)
  const onChangeColor: ISwitchProps['onChange'] = ({ checked }) =>
    setColor(checked ? 'black' : 'white')

  const onCreateGame = (): void => {
    // Офлайн режим устанавливает правила сам
    if (!online) {
      setGlobalMode(onlineMode)
      setUserColor(color)
      setGlobalRules(rules)
      updateBoard(initialBoard)
    }

    createGame({
      type: GameType.CHECKERS,
      rules,
      userColor: color,
      mode: online ? onlineMode : GameMode.OFFLINE
    })
  }

  return (
    <>
      <Wrapper direction="column">
        <Flex direction="column">
          <CenteredText>Please, setting checkers rules</CenteredText>
          {Object.entries(rules).map(([key, value]) => (
            <Switch
              key={key}
              id={key}
              initialChecked={value}
              label={ruleTitles[key as TRules]}
              onChange={changeHandler}
            />
          ))}
        </Flex>
        {online && (
          <Flex direction="column">
            <CenteredText>Do you want to play with your friends?</CenteredText>
            <Switch
              id="coupleGame"
              label="Cooperative game"
              onChange={onChangeGameMode}
            />
          </Flex>
        )}
        <Flex direction="column">
          <CenteredText>Prefer black color?</CenteredText>
          <Switch
            id="blackColor"
            label="Black color"
            onChange={onChangeColor}
          />
        </Flex>
      </Wrapper>
      <Button size="sm" onClick={onCreateGame}>
        Go!
      </Button>
    </>
  )
}
