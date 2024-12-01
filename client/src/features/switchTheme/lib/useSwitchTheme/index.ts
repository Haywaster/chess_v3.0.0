import { useShallow } from 'zustand/react/shallow'

import { useInitialEffect } from 'shared/lib'

import { themes, useTheme } from '../../model'

export const useSwitchTheme = () => {
  const { theme, setTheme } = useTheme(
    useShallow(({ theme, setTheme }) => ({ theme, setTheme }))
  )

  useInitialEffect(() => {
    const useDark = window.matchMedia('(prefers-color-scheme: dark)')
    const localStorageTheme = localStorage.getItem('theme')
    const newUser = !localStorageTheme

    if (newUser && useDark.matches) {
      document.documentElement.classList.add('dark')
      setTheme('dark')
      return
    }

    document.documentElement.className = theme
  })

  return () => {
    const currentThemeIndex = themes.indexOf(theme)

    switch (currentThemeIndex) {
      case themes.length - 1:
      case -1:
        setTheme(themes[0])
        document.documentElement.className = themes[0]
        break
      default:
        setTheme(themes[currentThemeIndex + 1])
        document.documentElement.className = themes[currentThemeIndex + 1]
        break
    }
  }
}
