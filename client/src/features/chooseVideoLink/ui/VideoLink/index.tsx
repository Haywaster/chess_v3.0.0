import { type FC, memo } from 'react'
import styled from 'styled-components'

import { type TGameType } from 'entities/Game'

interface IProps {
  game: TGameType
  onClick: (game: TGameType) => void
}

const Wrapper = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  cursor: pointer;

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
  const { game, onClick } = props

  const clickHandler = (): void => {
    onClick(game)
  }

  return (
    <Wrapper onClick={clickHandler}>
      {videoElements.map((VideoItem, index) => (
        <VideoItem
          key={index}
          autoPlay
          loop
          muted
          src={`${game.toLowerCase()}.webm`}
          typeof="video/webp"
        />
      ))}
      <StyledParagraph>{game}</StyledParagraph>
    </Wrapper>
  )
})
