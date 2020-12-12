import merge from 'lodash.merge'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles'

const baseMuiThemeOptions = {
  sav3: {
    layout: {
      columns: {
        left: {maxWidth: 100},
        middle: {maxWidth: 600},
        right: {maxWidth: 100}
      }
    }
  }
}

const createTheme = (muiThemeOptions) => {
  let theme = createMuiTheme(merge({}, baseMuiThemeOptions, muiThemeOptions))
  theme = responsiveFontSizes(theme)
  return theme
}

export default createTheme
