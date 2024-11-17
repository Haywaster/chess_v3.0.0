import { type FC, memo } from 'react'
import styled from 'styled-components'

interface IProps {
  values: string[]
  className?: string
}

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
`

const ListItem = styled.li`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const OrderCellWrapper: FC<IProps> = memo(props => {
  const { values, className } = props

  return (
    <List className={className}>
      {values.map(item => (
        <ListItem className="title" key={item}>
          {item}
        </ListItem>
      ))}
    </List>
  )
})
