import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CreateIcon from '@material-ui/icons/Create'
import HomeIcon from '@material-ui/icons/Home'
import SearchIcon from '@material-ui/icons/Search'
import {Link as RouterLink, useRouteMatch} from 'react-router-dom'
import PublishPostModal from 'src/components/publish-post/modal'
import BarChartIcon from '@material-ui/icons/BarChart'
import PeersIcon from '@material-ui/icons/Wifi'

const useStyles = makeStyles((theme) => ({
  menu: {
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

function BottomMenu ({className} = {}) {
  const classes = useStyles()
  const route = useRouteMatch('/:route')
  const activeMenu = route && route.params && route.params.route ? route.params.route : 'home'

  return (
    <Box className={className}>
      <BottomNavigation value={activeMenu} className={classes.menu}>
        <PublishPostButton />
        <BottomNavigationAction component={RouterLink} to='/' value='home' icon={<HomeIcon />} />
        <BottomNavigationAction component={RouterLink} to='/search' value='search' icon={<SearchIcon />} />
        <BottomNavigationAction component={RouterLink} to='/peers' value='peers' icon={<PeersIcon />} />
        <BottomNavigationAction component={RouterLink} to='/stats' value='stats' icon={<BarChartIcon />} />
      </BottomNavigation>
      {/* give real height to fixed bottom nav */}
      <Box width={0} className='MuiBottomNavigation-root' />
    </Box>
  )
}

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
