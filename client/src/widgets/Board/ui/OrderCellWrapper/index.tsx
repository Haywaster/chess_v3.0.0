import { type FC, memo } from 'react'
import styled from 'styled-components'

import { Flex } from 'shared/ui/Flex'

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
    <List as="ul" size={0} className={className}>
      {values.map(item => (
        <ListItem
          align="center"
          justify="center"
          as="li"
          className="title"
          key={item}
        >
          {item}
        </ListItem>
      ))}
    </List>
  )
})
