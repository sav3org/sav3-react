import {useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import PropTypes from 'prop-types'
import useTranslation from 'src/translations/use-translation'
import ShareIcon from '@material-ui/icons/ShareOutlined'
import Tooltip from '@material-ui/core/Tooltip'
import urlUtils from 'src/lib/utils/url'
import useCopyClipboard from 'src/hooks/utils/use-copy-clipboard'

const useStyles = makeStyles((theme) => ({
  menu: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.sav3.popoverMenu.borderRadius
    }
  },
  menuItemIcon: {
    minWidth: 28
  },
  moreIconButton: {
    padding: theme.spacing(1.25)
  }
}))

function ProfileMoreMenu ({userCid} = {}) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton className={classes.moreIconButton} onClick={handleClick}>
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
        <ShareMenuItem userCid={userCid} onClose={handleClose} />
      </Menu>
    </div>
  )
}

ProfileMoreMenu.propTypes = {
  userCid: PropTypes.string.isRequired
}

function ShareMenuItem ({userCid, onClose} = {}) {
  const classes = useStyles()
  const t = useTranslation()

  const [isCopied, setCopied] = useCopyClipboard(1100)
  const getUrl = () => {
    const encodedPostCid = urlUtils.encodeCid(userCid)
    return `${window.location.origin}/#/profile/${encodedPostCid}`
  }

  const handleClick = () => {
    setCopied(getUrl())
    if (onClose) {
      onClose()
    }
  }

  return (
    <Tooltip title={t['Copied to clipboard']()} open={isCopied} enterDelay={500} leaveDelay={200}>
      <MenuItem onClick={handleClick}>
        <ListItemIcon className={classes.menuItemIcon}>
          <ShareIcon fontSize='small' />
        </ListItemIcon>
        <Typography>{t.Share()}</Typography>
      </MenuItem>
    </Tooltip>
  )
}

ShareMenuItem.propTypes = {
  userCid: PropTypes.string.isRequired,
  onClose: PropTypes.func
}

export default ProfileMoreMenu
