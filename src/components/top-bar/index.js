import {makeStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default
  },
  // default material ui sticky app bar doesn't stick unless it's at the top of dom
  // and has a weird shaking bug when scrolling in chrome
  appBarSticky: {
    position: 'fixed',
    left: 'auto',
    right: 'auto',
    [theme.breakpoints.up('xs')]: {
      width: theme.sav3.layout.columns.middle.width.md - theme.sav3.borderWidth * 2
    },
    [theme.breakpoints.down('xs')]: {
      width: `calc(100% - ${theme.sav3.borderWidth * 2}px)`
    }
  }
}))

/**
 * @param {object} props
 * @param {string} props.children
 * @returns {JSX.Element}
 */
function TopBar ({children}) {
  const classes = useStyles()
  return (
    <MuiAppBar position='sticky' color='transparent' elevation={0} classes={{positionSticky: classes.appBarSticky}} className={classes.appBar}>
      <Toolbar disableGutters>{children}</Toolbar>
      <Divider />
    </MuiAppBar>
  )
}

export default TopBar
