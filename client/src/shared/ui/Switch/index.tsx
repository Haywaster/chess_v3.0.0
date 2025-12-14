import { type FC, memo, useState } from 'react'
import styled, { css } from 'styled-components'

interface ISwitch {
  id: string
  onChange: ({ id, checked }: { id: string; checked: boolean }) => void
  initialChecked?: boolean
  label?: string
}

interface IStyledProps {
  $checked?: boolean
}

const Track = styled.div`
  padding: 4px;
  min-width: 44px;
  background-color: var(--black);
  border-radius: 15px;
  transition: background-color 0.2s;
  cursor: pointer;
`

const Toggle = styled.div`
  width: 16px;
  aspect-ratio: 1;
  background-color: var(--white);
  border-radius: 50%;
  transition: transform 0.1s linear;
`

const StyledSwitch = styled.label<IStyledProps>`
  display: inline-flex;
  align-items: center;
  gap: 16px;

  & > span {
    font-size: 20px;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  ${p =>
    p.$checked &&
    css`
      ${Track} {
        background-color: var(--primary-color);
      }

      ${Toggle} {
        transform: translateX(20px);
      }
    `}
`

export const Switch: FC<ISwitch> = memo(props => {
  const { id, initialChecked = false, onChange, label } = props
  const [checked, setChecked] = useState(initialChecked)

  const toggleSwitch = (): void => {
    setChecked(prev => !prev)
    onChange({ id, checked: !checked })
  }

  return (
    <StyledSwitch $checked={checked}>
      <input
        checked={checked}
        name={id}
        style={{ display: 'none' }}
        type="checkbox"
        onChange={toggleSwitch}
      />
      <Track>
        <Toggle />
      </Track>
      <span>{label}</span>
    </StyledSwitch>
  )
})
