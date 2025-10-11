import { Themes } from 'shared/const/themes'
import { useInitialEffect } from 'shared/lib'
import { useTheme, useSetTheme } from 'shared/store'

export const useSwitchTheme = () => {
  const theme = useTheme()
  const setTheme = useSetTheme()

  useInitialEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    const newUser = !localStorage.getItem('application')

    // В store изначальная цветовая схема определена как светлая, поэтому мы с ней не возимся
    if (prefersDark.matches && newUser) {
      document.documentElement.classList.add('dark')
      setTheme('dark')
      return
    }

    document.documentElement.className = theme
  })

  return () => {
    const currentThemeIndex = Themes.indexOf(theme)

    switch (currentThemeIndex) {
      case Themes.length - 1:
      case -1:
        setTheme(Themes[0])
        document.documentElement.className = Themes[0]
        break
      default:
        setTheme(Themes[currentThemeIndex + 1])
        document.documentElement.className = Themes[currentThemeIndex + 1]
        break
    }
  }
}
