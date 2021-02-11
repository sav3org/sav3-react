import {useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import {makeStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ExportIcon from '@material-ui/icons/ImportExport'
import PropTypes from 'prop-types'
import useTranslation from 'src/translations/use-translation'
import ShareIcon from '@material-ui/icons/ShareOutlined'
import Tooltip from '@material-ui/core/Tooltip'
import urlUtils from 'src/lib/utils/url'
import useCopyClipboard from 'src/hooks/utils/use-copy-clipboard'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import {Link as RouterLink} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  menu: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.sav3.popoverMenu.borderRadius
    }
  },
  menuItemIcon: {
    minWidth: 28,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  moreIconButton: {
    padding: theme.spacing(1.25)
  },
  link: {
    textDecoration: 'inherit',
    color: 'inherit'
  }
}))

function ProfileMoreMenu ({userCid} = {}) {
  const ownCid = useOwnUserCid()
  const t = useTranslation()
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isOwnProfile = ownCid === userCid

  return (
    <div>
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
        <ShareMenuItem userCid={userCid} onClose={handleClose} />
        {isOwnProfile && (
          <MenuItem button={true} onClick={handleClick}>
            <ListItemIcon className={classes.menuItemIcon}>
              <ExportIcon fontSize='small' />
            </ListItemIcon>
            <Typography className={classes.link} component={RouterLink} to='/export' variant='body1'>
              {t.Import()} / {t.Export()}
            </Typography>
          </MenuItem>
        )}
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
      <MenuItem button={true} onClick={handleClick}>
        <ListItemIcon className={classes.menuItemIcon}>
          <ShareIcon fontSize='small' />
        </ListItemIcon>
        <Typography variant='body1'>{t.Share()}</Typography>
      </MenuItem>
    </Tooltip>
  )
}

ShareMenuItem.propTypes = {
  userCid: PropTypes.string.isRequired,
  onClose: PropTypes.func
}

export default ProfileMoreMenu
