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

const useStyles = makeStyles((theme) => ({
  leftColumn: {
    width: theme.sav3.layout.columns.left.maxWidth
  },
  middleColumn: {
    width: theme.sav3.layout.columns.middle.maxWidth
  },
  rightColumn: {
    width: theme.sav3.layout.columns.right.maxWidth
  }
}))

/**
 * @returns {JSX.Element}
 */
function App () {
  const classes = useStyles()
  const theme = useTheme()
  console.log({theme})

  return (
    <Grid container justify='center'>
      <Grid item className={classes.leftColumn}>
        <Paper>xs=3</Paper>
      </Grid>
      <Grid item className={classes.middleColumn}>
        <Paper>xs=3</Paper>
      </Grid>
      <Grid item className={classes.rightColumn}>
        <Paper>xs=3</Paper>
      </Grid>
    </Grid>
  )
}

export default App
