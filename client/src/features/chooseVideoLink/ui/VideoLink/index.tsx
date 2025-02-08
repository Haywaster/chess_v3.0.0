import { type FC, memo } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import styled from 'styled-components'

import { type IVideoLink } from '../../model'

interface IProps extends Omit<LinkProps, 'to'> {
  videoLink: IVideoLink
}

const StyledLink = styled(Link)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-decoration: none;

  &:before {
    content: '';
    backdrop-filter: blur(4px);
    background-color: hsla(0, 0%, 95%, 0.012);
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    z-index: 1;
  }
`

const StyledVideo = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`

const StyledVideoMain = styled(StyledVideo)`
  z-index: 1;
`

const StyledVideoBg = styled(StyledVideo)`
  object-fit: cover;
`

const StyledParagraph = styled.h3`
  z-index: 1;
  color: var(--black-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  background-color: hsla(0, 0%, 95%, 0.5);
  padding: 4px;
  border-radius: 4px;
`

const videoElements = [StyledVideoBg, StyledVideoMain]

export const VideoLink: FC<IProps> = memo(props => {
  const { videoLink, ...linkProps } = props

  const { title, route } = videoLink

  return (
    <StyledLink to={route} {...linkProps}>
      {videoElements.map((VideoItem, index) => (
        <VideoItem
          key={index}
          autoPlay
          loop
          muted
          src={`${title}.webm`}
          typeof="video/webp"
        />
      ))}
      <StyledParagraph>{title}</StyledParagraph>
    </StyledLink>
  )
})
