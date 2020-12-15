import merge from 'lodash.merge'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles'

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
          md: {width: 275},
          sm: {width: 88},
          xs: {width: 68}
        },
        middle: {
          md: {width: 600}
        },
        right: {
          lg: {width: 350},
          md: {width: 290}
        }
      }
    }
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
