import { type FC, memo } from 'react'
import { type LinkProps } from 'react-router-dom'
import styled from 'styled-components'

import { Flex } from 'shared/ui/Flex'

import { type IVideoLink } from '../../model'
import { VideoLink } from '../VideoLink'

const Container = styled(Flex)`
  height: 300px;
`

interface IProps {
  videoLinks: IVideoLink[]
  onClick: LinkProps['onClick']
}

export const VideoLinks: FC<IProps> = memo(props => {
  const { videoLinks, onClick } = props

  return (
    <Container as="nav">
      {videoLinks.map(item => (
        <VideoLink videoLink={item} key={item.route} onClick={onClick} />
      ))}
    </Container>
  )
})
