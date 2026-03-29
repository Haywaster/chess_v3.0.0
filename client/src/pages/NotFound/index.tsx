import type { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { RouterPath } from 'shared/const/router.ts'
import { Button, Flex } from 'shared/ui'
import { MainHeader } from 'widgets/Header'

const Container = styled(Flex).attrs({
  direction: 'column',
  justify: 'center',
  align: 'center'
})`
  margin-top: 30px;
  flex: 1;
  background-color: var(--border-link-color);
  border-radius: 10px;
`

export const NotFound: FC = () => {
  const navigate = useNavigate()

  const goBack = (): void => navigate(-1)

  return (
    <>
      <MainHeader />
      <Container>
        <h1>Not Found page :(</h1>
        <Flex>
          <Button as={Link} to={RouterPath.HOME}>
            Go to main
          </Button>
          <Button onClick={goBack}>Go to back</Button>
        </Flex>
      </Container>
    </>
  )
}
