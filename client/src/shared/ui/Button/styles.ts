import { css, type RuleSet } from 'styled-components'

import type { BtnMode, BtnSize } from './types.ts'

// base
export const base = css`
  width: fit-content;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out;
  text-decoration: none;

  &:disabled {
    opacity: 0.7;
    pointer-events: none;
  }
`

// size
export const size: Record<BtnSize, RuleSet<object>> = {
  lg: css`
    height: 48px;
    padding: 8px 16px;
  `,
  sm: css`
    height: 40px;
    padding: 6px 12px;
  `,
  xs: css`
    height: 32px;
    padding: 4px 8px;
  `
}

// mode
export const mode: Record<BtnMode, RuleSet<object>> = {
  primary: css`
    background-color: var(--primary-color);

    @media (hover: hover) {
      &:hover {
        background-color: var(--primary-hover-color);
      }
    }

    &:active {
      background-color: var(--primary-active-color);
    }
  `,
  outline: css`
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
  `,
  ghost: css`
    color: var(--primary-color);
  `
}

// icon
export const icon = css`
  aspect-ratio: 1 / 1;

  & > svg {
    height: 100%;
    width: 100%;
  }

  &.lg {
    padding: 8px;
  }

  &.md {
    padding: 6px;
  }

  &.xs {
    padding: 4px;
  }
`

// isLink
export const isLink = css`
  display: flex;
  justify-content: center;
  align-items: center;
  color: initial;
`
