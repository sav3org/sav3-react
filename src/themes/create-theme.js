import merge from 'lodash.merge'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles'

const borderColor = 'rgb(127, 127, 127, 0.05)'

const baseMuiThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 668,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },
  sav3: {
    layout: {
      columns: {
        left: {
          width: {
            md: 275,
            sm: 88,
            xs: 68
          }
        },
        middle: {
          width: {
            md: 600
          },
          borderWidth: 1
        },
        right: {
          width: {
            lg: 350,
            md: 290
          }
        }
      }
    },
    borderWidth: 1,
    borderColor
  },
  palette: {
    divider: borderColor
  },
  overrides: {
    MuiToolbar: {
      root: {
        minHeight: '54px!important'
      }
    },
    MuiAppBar: {
      positionSticky: {
        // fix weird bug when scrolling chrome adds 1 extra pixel at top
        top: -1
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
