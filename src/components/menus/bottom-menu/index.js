import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import FolderIcon from '@material-ui/icons/Folder'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    // stick to bottom
    width: '100%',
    position: 'fixed',
    bottom: 0
  }
}))

/**
 * @param {object} props
 * @param {string} props.className
 * @returns {JSX.Element}
 */
function BottomMenu ({className} = {}) {
  const classes = useStyles()
  const [value, setValue] = React.useState('recents')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const rootClassName = className ? clsx(classes.root, className) : classes.root

  return (
    <BottomNavigation value={value} onChange={handleChange} className={rootClassName}>
      <BottomNavigationAction value='recents' icon={<RestoreIcon />} />
      <BottomNavigationAction value='favorites' icon={<FavoriteIcon />} />
      <BottomNavigationAction value='nearby' icon={<LocationOnIcon />} />
      <BottomNavigationAction value='folder' icon={<FolderIcon />} />
    </BottomNavigation>
  )
}

export default BottomMenu
