import {useState} from 'react'
import Avatar from '@material-ui/core/Avatar'
import useUserProfile from 'src/hooks/user/use-user-profile'
import IconButton from '@material-ui/core/IconButton'
import useOwnPeerCid from 'src/hooks/use-own-peer-cid'
import {makeStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Menu from './index'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.sav3.topBar.height / 1.75,
    height: theme.sav3.topBar.height / 1.75
  }
}))

function AvatarDrawerMenuButton () {
  const userCid = useOwnPeerCid()
  const classes = useStyles()
  const profile = useUserProfile(userCid)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div>
      <IconButton style={{backgroundColor: 'transparent'}} disableRipple disableFocusRipple onClick={() => setDrawerOpen(true)}>
        <Avatar src={profile.thumbnailUrl} className={classes.avatar} />
      </IconButton>
      <Drawer achor='left' elevation={2} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Menu />
      </Drawer>
    </div>
  )
}

export default AvatarDrawerMenuButton
