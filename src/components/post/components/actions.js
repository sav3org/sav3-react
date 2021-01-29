import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FavoriteIcon from '@material-ui/icons/FavoriteBorderOutlined'
import ShareIcon from '@material-ui/icons/ShareOutlined'
import RepeatIcon from '@material-ui/icons/Repeat'
import CommentIcon from '@material-ui/icons/ModeCommentOutlined'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import PublishPostModal from 'src/components/publish-post/modal'
import PropTypes from 'prop-types'
import urlUtils from 'src/lib/utils/url'
import usePostReplyCids from 'src/hooks/post/use-post-reply-cids'
import usePostQuoteCids from 'src/hooks/post/use-post-quote-cids'
import useCopyClipboard from 'src/hooks/utils/use-copy-clipboard'
import useTranslation from 'src/translations/use-translation'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import sav3Ipfs from 'src/lib/sav3-ipfs'

const useStyles = makeStyles((theme) => ({
  actions: {
    paddingTop: theme.spacing(0.5),
    maxWidth: theme.sav3.layout.columns.middle.width.md * 0.75,
    marginLeft: theme.spacing(-1)
  },
  actionIconButton: {
    padding: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
      color: theme.palette.text.secondary
    }
  },
  menu: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.sav3.popoverMenu.borderRadius
    }
  },
  menuItemIcon: {
    minWidth: 28,
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing()
  }
}))

function ReplyButton ({parentPost} = {}) {
  const classes = useStyles()
  const postReplyCids = usePostReplyCids(parentPost.cid)

  const [openPublishPostModal, setOpenPublishPostModal] = useState(false)
  return (
    <Box display='flex' alignItems='center' onClick={(event) => event.stopPropagation()}>
      <IconButton className={classes.actionIconButton} onClick={() => setOpenPublishPostModal(true)}>
        <CommentIcon />
      </IconButton>
      {postReplyCids.length !== 0 && <Typography variant='caption'>{postReplyCids.length}</Typography>}
      <PublishPostModal parentPost={parentPost} open={openPublishPostModal} onClose={() => setOpenPublishPostModal(false)} />
    </Box>
  )
}
ReplyButton.propTypes = {parentPost: PropTypes.object.isRequired}

function ShareButton ({postCid} = {}) {
  const classes = useStyles()
  const t = useTranslation()
  const [isCopied, setCopied] = useCopyClipboard(1100)
  const getUrl = () => {
    const encodedPostCid = urlUtils.encodeCid(postCid)
    return `${window.location.origin}/#/post/${encodedPostCid}`
  }
  return (
    <Tooltip title={t['Copied to clipboard']()} open={isCopied} enterDelay={500} leaveDelay={200}>
      <IconButton onClick={() => setCopied(getUrl())} className={classes.actionIconButton}>
        <ShareIcon />
      </IconButton>
    </Tooltip>
  )
}
ShareButton.propTypes = {postCid: PropTypes.string.isRequired}

function Resav3Button ({quotedPost} = {}) {
  const classes = useStyles()
  const postQuoteCids = usePostQuoteCids(quotedPost.cid)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleResav3 = async () => {
    await sav3Ipfs.publishPost({quotedPostCid: quotedPost.cid})
    handleClose()
  }

  return (
    <Box display='flex' alignItems='center' onClick={(event) => event.stopPropagation()}>
      <IconButton className={classes.actionIconButton} onClick={handleClick}>
        <RepeatIcon style={{transform: 'rotate(90deg)'}} />
      </IconButton>
      {postQuoteCids.length !== 0 && <Typography variant='caption'>{postQuoteCids.length}</Typography>}

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
        <Resav3MenuItem onClick={handleResav3} />
      </Menu>
    </Box>
  )
}
Resav3Button.propTypes = {quotedPost: PropTypes.object.isRequired}

function Resav3MenuItem ({onClick} = {}) {
  const classes = useStyles()
  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon className={classes.menuItemIcon}>
        <RepeatIcon fontSize='small' style={{transform: 'rotate(90deg)'}} />
      </ListItemIcon>
      <Typography>RESAV3</Typography>
    </MenuItem>
  )
}

function LikeButton () {
  const classes = useStyles()
  return (
    <IconButton className={classes.actionIconButton}>
      <FavoriteIcon />
    </IconButton>
  )
}

function PostActions ({post} = {}) {
  const classes = useStyles()

  return (
    <Box display='flex' justifyContent='space-between' className={classes.actions}>
      <ReplyButton parentPost={post} />
      <Resav3Button quotedPost={post} />
      <LikeButton />
      <ShareButton postCid={post.cid} />
    </Box>
  )
}
PostActions.propTypes = {post: PropTypes.object.isRequired}

export default PostActions
