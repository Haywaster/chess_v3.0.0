import { type FC, memo } from 'react'
import styled from 'styled-components'

import { Flex } from 'shared/ui'

interface IProps {
  values: string[]
  className?: string
}

const List = styled(Flex)`
  list-style: none;
  padding: 0;
  margin: 0;
`

const ListItem = styled(Flex)`
  flex: 1;
`

export const OrderCellWrapper: FC<IProps> = memo(props => {
  const { values, className } = props

  return (
    <List as="ul" className={className} size={0}>
      {values.map(item => (
        <ListItem
          key={item}
          align="center"
          as="li"
          className="title"
          justify="center"
        >
          {item}
        </ListItem>
      ))}
    </List>
  )
})
