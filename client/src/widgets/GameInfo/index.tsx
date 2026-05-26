import styled from 'styled-components'

import { type IFigure } from 'entities/Figure'
import { Flex } from 'shared/ui'

import type { FC } from 'react'

interface IProps {
  currentMove?: IFigure['color']
  countFigures?: Record<IFigure['color'], number>
}

const Text: Record<IFigure['color'], string> = {
  white: 'белых',
  black: 'чёрных'
}

interface ITextPictogramProps {
  currentMove: IFigure['color']
}

const TextWithPictogram: FC<ITextPictogramProps> = props => {
  const { currentMove } = props
  const text = `Ход ${Text[currentMove]}`

  return (
    <Flex align="center">
      <p>{text}</p>
      <div
        style={{
          backgroundColor: currentMove,
          width: 5,
          aspectRatio: '1/1',
          borderRadius: '100%'
        }}
      />
    </Flex>
  )
}

const Wrapper = styled(Flex)`
  width: fit-content;
  background-color: var(--header-bg);
  padding: 10px;
  border-radius: 10px;
`

export const GameInfo: FC<IProps> = props => {
  const { currentMove } = props

  return (
    <Wrapper justify="center">
      {currentMove && <TextWithPictogram currentMove={currentMove} />}
      {/*{countFigures && <TextWithPictogram currentMove={currentMove} />}*/}
    </Wrapper>
  )
}
