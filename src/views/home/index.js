import {useState} from 'react'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import useUserProfile from 'src/hooks/use-user-profile'
import TopBar from 'src/components/top-bar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import useOwnPeerCid from 'src/hooks/use-own-peer-cid'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Drawer from '@material-ui/core/Drawer'
import Menu from './menu'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.sav3.topBar.height / 1.75,
    height: theme.sav3.topBar.height / 1.75
  }
}))

/**
 * @returns {JSX.Element}
 */
function Home () {
  const userCid = useOwnPeerCid()
  const classes = useStyles()
  const profile = useUserProfile(userCid)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  console.log('Home', {userCid, profile})

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div>
      <TopBar>
        {fullScreen && (
          <Box pl={2} pr={1}>
            <IconButton style={{backgroundColor: 'transparent'}} disableRipple disableFocusRipple onClick={() => setDrawerOpen(true)}>
              <Avatar src={profile.thumbnailUrl} className={classes.avatar} />
            </IconButton>
            <Drawer achor='left' elevation={2} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Menu />
            </Drawer>
          </Box>
        )}
        <Box pl={2}>
          <Typography variant='h6'>Home</Typography>
        </Box>
      </TopBar>
    </div>
  )
}

export default Home
