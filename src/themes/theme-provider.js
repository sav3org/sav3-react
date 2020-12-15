import React, {useState} from 'react'
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles'
import themes from './index'
import useMediaQuery from '@material-ui/core/useMediaQuery'

export const ThemeContext = React.createContext({
  theme: 'Light',
  setTheme: null
})

const ThemeProvider = (props) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const defaultThemeName = prefersDarkMode ? 'Dark' : 'Light'
  let localStorageThemeName = localStorage.getItem('muiTheme') || defaultThemeName
  if (!themes[localStorageThemeName]) {
    console.warn(`no available theme for '${localStorageThemeName}'`)
    localStorageThemeName = defaultThemeName
  }

  // State to hold the selected theme name
  const [themeName, _setThemeName] = useState(localStorageThemeName)

  // Retrieve the theme object by theme name
  const theme = themes[themeName]

  // Wrap _setThemeName to store new theme names in localStorage
  const setThemeName = (themeName) => {
    if (!themes[themeName]) {
      console.warn(`no available theme for '${themeName}'`)
      return
    }
    localStorage.setItem('muiTheme', themeName)
    _setThemeName(themeName)
  }

  const contextValue = {
    theme: themeName,
    setTheme: setThemeName
  }

  const {children} = props
  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
