import {Switch, Route, Link} from 'react-router-dom'
import PeersIps from 'src/views/demo/peers-ips'
import PeersPosts from 'src/views/demo/peers-posts'
import Profile from 'src/views/profile'
import {ThemeContext} from 'src/themes/theme-provider'
import {useContext} from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import themes from 'src/themes'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import LeftMenu from 'src/components/menus/left-menu'
import BottomMenu from 'src/components/menus/bottom-menu'
import ThemeSwitcher from 'src/components/theme-switcher'
import TranslationSwitcher from 'src/components/translation-switcher'
import Divider from '@material-ui/core/Divider'

// app bar
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'

const useStyles = makeStyles((theme) => ({
  leftColumn: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
    [theme.breakpoints.down('md')]: {
      width: theme.sav3.layout.columns.left.width.sm
    },
    [theme.breakpoints.down('lg')]: {
      width: theme.sav3.layout.columns.left.width.xs
    },
    [theme.breakpoints.up('lg')]: {
      width: theme.sav3.layout.columns.left.width.md
    }
  },
  middleColumn: {
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    [theme.breakpoints.up('xs')]: {
      width: theme.sav3.layout.columns.middle.width.md
    },
    // borders
    borderLeftWidth: theme.sav3.borderWidth,
    borderRightWidth: theme.sav3.borderWidth,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderStyle: 'solid',
    borderColor: theme.sav3.borderColor
  },
  rightColumn: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.down('lg')]: {
      width: theme.sav3.layout.columns.right.width.md
    },
    [theme.breakpoints.up('lg')]: {
      width: theme.sav3.layout.columns.right.width.lg
    }
  },
  bottomMenu: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  appBar: {
    backgroundColor: theme.palette.background.default
  }
}))

/**
 * @returns {JSX.Element}
 */
function App () {
  const classes = useStyles()
  const theme = useTheme()
  window.theme = theme
  console.log({theme})

  return (
    <div>
      <Grid container justify='center'>
        <Grid item className={classes.leftColumn}>
          <LeftMenu />
        </Grid>
        <Grid item className={classes.middleColumn}>
          <AppBar position='sticky' color='transparent' elevation={0} className={classes.appBar}>
            <Toolbar disableGutters>
              <IconButton>
                <ArrowBack />
              </IconButton>
              <Typography variant='h6'>Some User</Typography>
            </Toolbar>
            <Divider />
          </AppBar>
          <Profile />
        </Grid>
        <Grid item className={classes.rightColumn}>
          <ThemeSwitcher />
          <TranslationSwitcher />
        </Grid>
      </Grid>
      <BottomMenu className={classes.bottomMenu} />
    </div>
  )
}

export default App
