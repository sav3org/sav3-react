import {useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PersonAdd from '@material-ui/icons/PersonAdd'
import PersonAddDisabled from '@material-ui/icons/PersonAddDisabled'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import PropTypes from 'prop-types'
import useIsFollowing from 'src/hooks/following/use-is-following'
import useTranslation from 'src/translations/use-translation'
import Box from '@material-ui/core/Box'
import useOwnUserCid from 'src/hooks/use-own-user-cid'

const useStyles = makeStyles((theme) => ({
  menu: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.sav3.popoverMenu.borderRadius
    }
  },
  menuItemIcon: {
    minWidth: 28,
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing()
  },
  moreIconButton: {
    padding: theme.spacing(0.5),
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem'
    }
  }
}))

function PostMoreMenu ({post} = {}) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const ownCid = useOwnUserCid()

  if (post.userCid === ownCid) {
    // currently no more menu for own posts
    // return empty element same size as more button
    return <Box height={48} width={48} />
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <IconButton className={classes.moreIconButton} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        MenuListProps={{disablePadding: true}}
        className={classes.menu}
        elevation={4}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <FollowMenuItem userCid={post.userCid} />
      </Menu>
    </div>
  )
}
PostMoreMenu.propTypes = {
  post: PropTypes.object.isRequired
}

function FollowMenuItem ({userCid} = {}) {
  const classes = useStyles()
  const t = useTranslation()
  const [isFollowing, setIsFollowing] = useIsFollowing(userCid)

  let followButton = (
    <MenuItem onClick={() => setIsFollowing(true)}>
      <ListItemIcon className={classes.menuItemIcon}>
        <PersonAdd fontSize='small' />
      </ListItemIcon>
      <Typography variant='body1'>{t.Follow()}</Typography>
    </MenuItem>
  )
  if (isFollowing) {
    followButton = (
      <MenuItem onClick={() => setIsFollowing(false)}>
        <ListItemIcon className={classes.menuItemIcon}>
          <PersonAddDisabled fontSize='small' />
        </ListItemIcon>
        <Typography variant='body1'>{t.Unfollow()}</Typography>
      </MenuItem>
    )
  }
  return followButton
}
FollowMenuItem.propTypes = {
  userCid: PropTypes.string.isRequired
}

export default PostMoreMenu
