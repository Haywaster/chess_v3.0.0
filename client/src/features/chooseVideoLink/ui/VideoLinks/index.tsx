import { type FC, memo } from 'react'
import styled from 'styled-components'

import { type TGameType } from 'entities/Game'
import { Flex } from 'shared/ui/Flex'

import { VideoLink } from '../VideoLink'

const Container = styled(Flex)`
  height: 300px;
`

interface IProps {
  videoLinks: TGameType[]
  onClick: (game: TGameType) => void
}

export const VideoLinks: FC<IProps> = memo(props => {
  const { videoLinks, onClick } = props

  return (
    <Container as="nav">
      {videoLinks.map(item => (
        <VideoLink key={item} game={item} onClick={onClick} />
      ))}
    </Container>
  )
})
