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
import useIsFollowing from 'src/hooks/use-is-following'
import followManager from 'src/lib/follow-manager'
import useTranslation from 'src/translations/use-translation'
import Box from '@material-ui/core/Box'
import useOwnUserCid from 'src/hooks/use-own-user-cid'

const useStyles = makeStyles((theme) => ({
  menuItemIcon: {
    minWidth: 28
  }
}))

/**
 * @param {object} props
 * @param {object} props.post
 * @returns {JSX.Element}
 */
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
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
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

/**
 * @param {object} props
 * @param {object} props.userCid
 * @returns {JSX.Element}
 */
function FollowMenuItem ({userCid} = {}) {
  const classes = useStyles()
  const t = useTranslation()
  const followManagerIsFollowing = useIsFollowing(userCid)
  const [isFollowing, setIsFollowing] = useState()

  const handleFollow = () => {
    followManager.addFollowing(userCid)
    setIsFollowing(true)
  }

  const handleUnfollow = () => {
    followManager.deleteFollowing(userCid)
    setIsFollowing(false)
  }

  let followButton = ''
  if (followManagerIsFollowing === false || isFollowing === false) {
    followButton = (
      <MenuItem onClick={handleFollow}>
        <ListItemIcon className={classes.menuItemIcon}>
          <PersonAdd fontSize='small' />
        </ListItemIcon>
        <Typography>{t.Follow()}</Typography>
      </MenuItem>
    )
  }
  else if (followManagerIsFollowing === true) {
    followButton = (
      <MenuItem onClick={handleUnfollow}>
        <ListItemIcon className={classes.menuItemIcon}>
          <PersonAddDisabled fontSize='small' />
        </ListItemIcon>
        <Typography>{t.Unfollow()}</Typography>
      </MenuItem>
    )
  }
  return followButton
}

FollowMenuItem.propTypes = {
  userCid: PropTypes.string.isRequired
}

export default PostMoreMenu
