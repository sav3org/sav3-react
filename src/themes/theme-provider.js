import React, {useState} from 'react'
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles'
import themes from './index'
import useMediaQuery from '@material-ui/core/useMediaQuery'

export const ThemeContext = React.createContext({
  currentTheme: 'light',
  setTheme: null
})

const ThemeProvider = (props) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const defaultThemeName = prefersDarkMode ? 'dark' : 'light'

  // Read current theme from localStorage or maybe from an api
  const currentTheme = localStorage.getItem('muiTheme') || defaultThemeName

  // State to hold the selected theme name
  const [themeName, _setThemeName] = useState(currentTheme)

  // Retrieve the theme object by theme name
  const theme = themes[themeName]

  // Wrap _setThemeName to store new theme names in localStorage
  const setThemeName = (name) => {
    localStorage.setItem('muiTheme', name)
    _setThemeName(name)
  }

  const contextValue = {
    currentTheme: themeName,
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
