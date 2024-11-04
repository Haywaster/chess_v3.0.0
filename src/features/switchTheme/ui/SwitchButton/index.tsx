import { type FC } from 'react'
import styled from 'styled-components'

import { Button } from 'shared/ui/Button'

import { Sun, Moon } from '../../assets'
import { useSwitchTheme } from '../../lib'
import { useTheme } from '../../model'

const StyledButton = styled(Button)`
  background-color: var(--white);
`

export const SwitchButton: FC = () => {
  const theme = useTheme(state => state.theme)
  const toggleTheme = useSwitchTheme()

  const icon = theme === 'light' ? <Sun /> : <Moon />

  return (
    <StyledButton size="sm" mode="outline" icon onClick={toggleTheme}>
      {icon}
    </StyledButton>
  )
}
