import {ThemeContext} from 'src/themes/theme-provider'
import {useContext} from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import themes from 'src/themes'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  switcher: {
    fontSize: '0.8rem',
    '& .MuiSelect-root': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    }
  }
}))

function ThemeSwitcher () {
  const classes = useStyles()
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
    <Select className={classes.switcher} value={theme} onChange={handleThemeChange} label='Theme' variant='outlined'>
      {themeMenuItems}
    </Select>
  )
}

export default ThemeSwitcher
