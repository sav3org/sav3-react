import merge from 'lodash.merge'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles'

// use neutral grey border color so it looks OK on
// both light and dark theme
// default borders and dividers are too opaque
const borderColor = 'rgb(127, 127, 127, 0.05)'

// regular top bar is too big
const topBarHeight = 54

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
          }
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
    borderColor,
    topBar: {
      height: topBarHeight
    },
    drawerMenu: {
      width: 280
    }
  },
  palette: {
    divider: borderColor
  },
  shape: {
    // buttons are not rounded enough
    borderRadius: 24
  },
  overrides: {
    MuiToolbar: {
      root: {
        // top bar is too wide
        minHeight: `${topBarHeight}px!important`
      }
    },
    MuiDialog: {
      paper: {
        margin: 0
      },
      paperFullWidth: {
        // regular full width has padding on mobile
        width: '100%'
      }
    },
    MuiSvgIcon: {
      fontSizeLarge: {
        // left menu icons are too big
        fontSize: '1.8rem'
      }
    },
    MuiFab: {
      root: {
        // default box shadow is too intense
        boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 8px, rgba(101, 119, 134, 0.25) 0px 1px 3px 1px'
      }
    },
    MuiPaper: {
      rounded: {
        // popover menus are too rounded
        borderRadius: 4
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
