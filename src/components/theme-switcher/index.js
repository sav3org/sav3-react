import {ThemeContext} from 'src/themes/theme-provider'
import {useContext} from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import themes from 'src/themes'

/**
 * @returns {JSX.Element}
 */
function ThemeSwitcher () {
  const {theme, setTheme} = useContext(ThemeContext)
  const handleThemeChange = (event) => {
    setTheme(event.target.value)
  }
  const themeMenuItems = []
  for (const themeName in themes) {
    themeMenuItems.push(
      <MenuItem key={themeName} value={themeName}>
        {themeName}
      </MenuItem>
    )
  }

  return (
    <Select value={theme} onChange={handleThemeChange} label='Theme' variant='outlined'>
      {themeMenuItems}
    </Select>
  )
}

export default ThemeSwitcher
