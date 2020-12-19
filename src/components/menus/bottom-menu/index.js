import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CreateIcon from '@material-ui/icons/Create'
import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MailIcon from '@material-ui/icons/Mail'
import clsx from 'clsx'
import {Link as RouterLink, useRouteMatch} from 'react-router-dom'
import PublishPostModal from 'src/components/publish-post-modal'

const useStyles = makeStyles((theme) => ({
  root: {
    // stick to bottom
    width: '100%',
    position: 'fixed',
    bottom: 0
  },
  createIconButtonBox: {
    right: theme.spacing(4),
    bottom: theme.spacing(8)
  },
  createIconButton: {
    // boxShadow: 'none'
  }
}))

/**
 * @param {object} props
 * @param {string} props.className
 * @returns {JSX.Element}
 */
function BottomMenu ({className} = {}) {
  const classes = useStyles()
  const route = useRouteMatch('/:route')
  const activeMenu = route && route.params && route.params.route ? route.params.route : 'home'

  const rootClassName = className ? clsx(classes.root, className) : classes.root

  return (
    <BottomNavigation value={activeMenu} className={rootClassName}>
      <PublishPostButton />
      <BottomNavigationAction component={RouterLink} to='/' value='home' icon={<HomeIcon />} />
      <BottomNavigationAction component={RouterLink} to='/search' value='search' icon={<SearchIcon />} />
      <BottomNavigationAction component={RouterLink} to='/notifications' value='notifications' icon={<NotificationsIcon />} />
      <BottomNavigationAction component={RouterLink} to='/mail' value='mail' icon={<MailIcon />} />
    </BottomNavigation>
  )
}

/**
 * @returns {JSX.Element}
 */
function PublishPostButton () {
  const classes = useStyles()

  const [openPublishPostModal, setOpenPublishPostModal] = useState(false)
  return (
    <Box position='absolute' className={classes.createIconButtonBox}>
      <Box my={2} pl={1} alignItems='center' display='flex' className={classes.createIconButton} onClick={() => setOpenPublishPostModal(true)}>
        <Fab className={classes.createIconButton} size='large'>
          <CreateIcon />
        </Fab>
      </Box>

      <PublishPostModal open={openPublishPostModal} onClose={() => setOpenPublishPostModal(false)} />
    </Box>
  )
}

export default BottomMenu
