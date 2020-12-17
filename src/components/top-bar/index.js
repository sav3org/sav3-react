import {makeStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default
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
    <MuiAppBar position='sticky' color='transparent' elevation={0} className={classes.appBar}>
      <Toolbar disableGutters>{children}</Toolbar>
      <Divider />
    </MuiAppBar>
  )
}

export default TopBar
