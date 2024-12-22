import { type FC, memo, type MouseEventHandler, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { RouterPath } from 'shared/const/router'
import { Button } from 'shared/ui/Button'
import { Modal } from 'shared/ui/Modal'

import { type IGame } from '../../model'
import { VideoLink } from '../VideoLink'

const Container = styled.nav`
  display: flex;
  gap: 10px;
  height: 300px;
`

interface IProps {
  games: IGame[]
  inputText: string
}

const RADIX = 16
const SLICE = 2

const uniqGameId = Math.random().toString(RADIX).slice(SLICE)

export const VideoLinks: FC<IProps> = memo(props => {
  const [modalLink, setModalLink] = useState<RouterPath | null>(null)
  const { games, inputText } = props

  const clickHandler: MouseEventHandler<HTMLAnchorElement> = (e): void => {
    if (!inputText) {
      e.preventDefault()
      return
    }
    const candidateLink = e.currentTarget.pathname as RouterPath
    setModalLink(candidateLink)
    e.preventDefault()
  }

  const closeModal = (): void => setModalLink(null)
  const gameLink = modalLink ? `${modalLink}/${uniqGameId}` : RouterPath.Home

  return (
    <Container>
      {games.map(game => (
        <VideoLink game={game} key={game.route} onClick={clickHandler} />
      ))}
      <Modal isOpen={!!modalLink} onClose={closeModal}>
        <h3>Hello, {inputText}!</h3>
        <p>
          Do you really want to play{' '}
          <b>{games.find(game => game.route === modalLink)?.title}</b>?
        </p>
        <Button as={Link} size="sm" to={gameLink}>
          Go!
        </Button>
      </Modal>
    </Container>
  )
})
