import {
  type FC,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  memo
} from 'react'
import styled from 'styled-components'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const StyledInput = styled.input.attrs(props => ({
  type: props.type ?? 'text',
  autoComplete: props.autoComplete ?? 'off'
}))`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
  background-color: var(--white);
  color: var(--black);

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  $name?: string
}

const Label = styled.label.attrs<LabelProps>(props => ({
  htmlFor: props.htmlFor ?? props.$name
}))`
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
  display: block;
`

const Wrapper = styled.div`
  width: 100%;
`

export const Input: FC<InputProps> = memo(({ label, ...props }) => {
  const input = <StyledInput {...props} />

  return !label ? (
    input
  ) : (
    <Wrapper>
      <Label $name={props.name}>{label}</Label>
      {input}
    </Wrapper>
  )
})
