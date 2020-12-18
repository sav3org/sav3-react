import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import CreateIcon from '@material-ui/icons/Create'
import Fab from '@material-ui/core/Fab'
import {Link as RouterLink} from 'react-router-dom'

// not sure if should show logo or not
// import IconButton from '@material-ui/core/IconButton'
// import logoBase64 from 'src/assets/images/logo'

const useStyles = makeStyles((theme) => ({
  logo: {
    height: '1.1em'
  },
  logoButton: {
    height: '2.2em',
    width: '2.2em'
  },
  createTextButtonBox: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  createIconButtonBox: {
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  },
  createIconButton: {
    boxShadow: 'none'
  },
  text: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  root: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  }
}))

/**
 * @returns {JSX.Element}
 */
function LeftMenu () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {/* not sure if should show logo or not
      <Box height={55} pl={0.5} alignItems="center" display="flex">
        <IconButton className={classes.logoButton}>
          <img src={logoBase64} className={classes.logo}/>
        </IconButton>
      </Box>
      */}
      <List>
        <ListItem button component={RouterLink} to='/'>
          <ListItemIcon>
            <HomeIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText primary='Home' className={classes.text} />
        </ListItem>
        <ListItem button component={RouterLink} to='/profile'>
          <ListItemIcon>
            <AccountCircle fontSize='large' />
          </ListItemIcon>
          <ListItemText primary='Profile' className={classes.text} />
        </ListItem>

        <Box my={2} mx={1} alignItems='center' display='flex' className={classes.createTextButtonBox}>
          <Button fullWidth variant='contained' size='large' disableElevation>
            SAV3
          </Button>
        </Box>

        <Box my={2} pl={1} alignItems='center' display='flex' className={classes.createIconButtonBox}>
          <Fab className={classes.createIconButton} size='medium'>
            <CreateIcon />
          </Fab>
        </Box>
      </List>
    </div>
  )
}

export default LeftMenu
