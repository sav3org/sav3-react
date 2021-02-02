import {Switch, Route} from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import LeftMenu from 'src/components/menus/left'
import BottomMenu from 'src/components/menus/bottom'
import Box from '@material-ui/core/Box'

// components
import ThemeSwitcher from 'src/components/theme-switcher'
import TranslationSwitcher from 'src/components/translation-switcher'
import FooterLinks from 'src/components/footer/links'

// routes
import Profile from 'src/views/profile'
import Home from 'src/views/home'
import Feed from 'src/views/feed'
import Search from 'src/views/search'
import Peers from 'src/views/peers'
import Stats from 'src/views/stats'
import Following from 'src/views/following'
import Export from 'src/views/export'
import Post from 'src/views/post'

const useStyles = makeStyles((theme) => ({
  leftColumn: {
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
    [theme.breakpoints.down('md')]: {
      width: theme.sav3.layout.columns.left.width.xs
    },
    [theme.breakpoints.down('lg')]: {
      width: theme.sav3.layout.columns.left.width.xs
    },
    [theme.breakpoints.up('lg')]: {
      width: theme.sav3.layout.columns.left.width.md
    }
  },
  middleColumn: {
    overflow: 'hidden',
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
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.down('lg')]: {
      width: theme.sav3.layout.columns.right.width.md,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    },
    [theme.breakpoints.up('lg')]: {
      width: theme.sav3.layout.columns.right.width.lg,
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
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

function App () {
  const classes = useStyles()
  const theme = useTheme()
  window.theme = theme

  return (
    <div>
      <Grid container justify='center'>
        <Grid item className={classes.leftColumn}>
          <LeftMenu />
        </Grid>
        <Grid item className={classes.middleColumn}>
          <Switch>
            <Route path='/' exact>
              <Home />
            </Route>
            <Route path='/feed' exact>
              <Feed />
            </Route>
            <Route path='/profile/:encodedCid?' exact>
              <Profile />
            </Route>
            <Route path='/search' exact>
              <Search />
            </Route>
            <Route path='/peers' exact>
              <Peers />
            </Route>
            <Route path='/stats' exact>
              <Stats />
            </Route>
            <Route path='/following' exact>
              <Following />
            </Route>
            <Route path='/export' exact>
              <Export />
            </Route>
            <Route path='/post/:encodedCid' exact>
              <Post />
            </Route>
          </Switch>
        </Grid>
        <Grid item className={classes.rightColumn}>
          <Box style={{opacity: 0.75}} mt={2} mb={2}>
            <ThemeSwitcher />
            <TranslationSwitcher />
          </Box>
          <Box>
            <FooterLinks />
          </Box>
        </Grid>
      </Grid>
      <BottomMenu className={classes.bottomMenu} />
    </div>
  )
}

export default App
