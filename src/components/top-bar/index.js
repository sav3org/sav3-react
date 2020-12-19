import {makeStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default
  },
  appBarSticky: {
    // fix weird bug when scrolling chrome adds 1 extra empty pixel at top
    top: -1,
    borderTop: `1px solid ${theme.palette.background.default}`
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
