import styled from 'styled-components'

import { Flex } from 'shared/ui'

export const HeaderWrapper = styled(Flex).attrs({
  as: 'header',
  justify: 'space-between',
  align: 'center'
})`
  padding: 10px;
  background-color: var(--header-bg);
  border-radius: 10px;
`
