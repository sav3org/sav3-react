import {Fragment, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FavoriteIcon from '@material-ui/icons/FavoriteBorderOutlined'
import ShareIcon from '@material-ui/icons/ShareOutlined'
import RepeatIcon from '@material-ui/icons/Repeat'
import CommentIcon from '@material-ui/icons/ModeCommentOutlined'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import {format as formatTimeAgo} from 'timeago.js'
import useLanguageCode from 'src/translations/use-language-code'
import assert from 'assert'
import urlRegex from 'url-regex'
import PostMoreMenu from './more-menu'
import {Link as RouterLink} from 'react-router-dom'
import PublishPostModal from 'src/components/publish-post/modal'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  imgMedia: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  avatar: {
    // slightly higher placement than the user name seems more pleasing
    marginTop: theme.spacing(-0.25),
    width: theme.spacing(6),
    height: theme.spacing(6),
    // borders
    borderWidth: theme.sav3.borderWidth,
    borderStyle: 'solid',
    borderColor: theme.sav3.borderColor
  },
  userCid: {
    wordBreak: 'break-all',
    // remove added styles from link component
    textDecoration: 'inherit'
  },
  displayName: {
    // remove added styles from link component
    color: 'inherit',
    textDecoration: 'inherit'
  },
  contentLink: {
    wordBreak: 'break-all'
  },
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
  }
}))

function Post ({post} = {}) {
  const languageCode = useLanguageCode()
  const classes = useStyles()
  const date = formatDate(post.timestamp, languageCode)

  return (
    <Box px={2} pt={1.5} pb={0.5} display='flex'>
      {/* left col avatar */}
      <Box pr={1.5}>
        <Avatar
          component={RouterLink}
          to={{pathname: '/profile', state: {userCid: post.userCid}}}
          src={post.profile.thumbnailUrl && forceHttps(post.profile.thumbnailUrl)}
          className={classes.avatar}
        />
      </Box>

      {/* right col header + content + bottom actions */}
      <Box width='100%'>
        {/* header */}
        <Box display='flex'>
          <Box flexGrow={1}>
            <Box display='flex'>
              {post.profile.displayName && (
                <Fragment>
                  <Typography className={classes.displayName} component={RouterLink} to={{pathname: '/profile', state: {userCid: post.userCid}}} variant='subtitle2'>
                    {post.profile.displayName}
                  </Typography>
                  &nbsp;
                  <Typography variant='subtitle2'>·</Typography>
                  &nbsp;
                </Fragment>
              )}
              <Typography variant='subtitle2'>{date}</Typography>
            </Box>
            <Box>
              <Typography component={RouterLink} to={{pathname: '/profile', state: {userCid: post.userCid}}} variant='caption' color='textSecondary' className={classes.userCid}>
                {post.userCid}
              </Typography>
            </Box>
          </Box>
          <Box>
            <PostMoreMenu post={post} />
          </Box>
        </Box>

        {/* content */}
        <PostContent content={post.content} />

        {/* actions */}
        <Box display='flex' justifyContent='space-between' className={classes.actions}>
          <ReplyIconButton parentPost={post} />
          <IconButton className={classes.actionIconButton}>
            <RepeatIcon style={{transform: 'rotate(90deg)'}} />
          </IconButton>
          <IconButton className={classes.actionIconButton}>
            <FavoriteIcon />
          </IconButton>
          <IconButton className={classes.actionIconButton}>
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

function ReplyIconButton ({parentPost} = {}) {
  const classes = useStyles()

  const [openPublishPostModal, setOpenPublishPostModal] = useState(false)
  return (
    <Fragment>
      <IconButton className={classes.actionIconButton} onClick={() => setOpenPublishPostModal(true)}>
        <CommentIcon />
      </IconButton>
      <PublishPostModal parentPost={parentPost} open={openPublishPostModal} onClose={() => setOpenPublishPostModal(false)} />
    </Fragment>
  )
}
ReplyIconButton.propTypes = {parentPost: PropTypes.object.isRequired}

function PostContent ({content} = {}) {
  const classes = useStyles()
  let contentComponents = [content]

  const link = getPostContentLink(content)
  if (link) {
    const [contentPart1, contentPart2] = content.split(link)
    let href = link
    if (!link.match(/^https?:\/\//)) {
      href = `https://${link}`
    }
    contentComponents = []
    if (contentPart1) {
      contentComponents.push(contentPart1)
    }
    contentComponents.push(
      <Link className={classes.contentLink} key='content link' variant='body2' href={href} target='_blank' rel='noopener'>
        {link}
      </Link>
    )
    if (contentPart2) {
      contentComponents.push(contentPart2)
    }
  }

  const mediaSrc = getPostContentMediaSrc(content)
  let cardMedia
  if (mediaSrc) {
    cardMedia = <CardMedia className={classes.imgMedia} image={mediaSrc} />
    if (linkIsVideo(mediaSrc)) {
      cardMedia = <CardMedia controls autoPlay muted component='video' image={mediaSrc} />
    }
  }

  const media = mediaSrc && (
    <Box pt={1}>
      <Card variant='outlined'>{cardMedia}</Card>
    </Box>
  )

  return (
    <Box>
      <Typography variant='body2'>{contentComponents}</Typography>
      {media}
    </Box>
  )
}
PostContent.propTypes = {content: PropTypes.string.isRequired}

// only use the first link in a post
const getPostContentLink = (content) => {
  if (!content) {
    return
  }
  assert(typeof content === 'string', `post content '${content}' is not a string`)
  const links = content.match(urlRegex({strict: false}))
  return links && links[0]
}

const getPostContentMediaSrc = (content) => {
  if (!content) {
    return
  }
  assert(typeof content === 'string', `post content '${content}' is not a string`)
  const links = content.match(urlRegex({strict: false}))
  let link = links && links[0]
  if (!link) {
    return
  }
  link = forceHttps(link)
  if (linkIsMedia(link)) {
    // add protocol if missing
    if (!link.match(/^https?:\/\//)) {
      link = `https://${link}`
    }
    return link
  }
}

const forceHttps = (link) => {
  assert(typeof link === 'string', `forceHttps link '${link}' not a string`)
  link = link.trim()
  link = link.replace(/^http:\/\//, 'https://')
  return link
}

const linkIsVideo = (link) => {
  // remove query string and match extension
  return link.replace(/[#?].*/).match(/\.(mp4|webm)$/)
}

const linkIsMedia = (link) => {
  // remove query string and match extension
  return link.replace(/[#?].*/).match(/\.(jpeg|jpg|png|gif|mp4|webm)$/)
}

const formatDate = (postTimestamp, languageCode) => {
  const day = 1000 * 60 * 60 * 24
  const year = 365 * day
  const timestamp = postTimestamp * 1000
  let date = new Date(timestamp).toLocaleString(languageCode, {month: 'short', day: 'numeric'})
  if (Date.now() > timestamp + year) {
    date = new Date(timestamp).toLocaleString(languageCode, {year: 'numeric', month: 'short', day: 'numeric'})
  }
  if (Date.now() < timestamp + day) {
    date = formatTimeAgo(timestamp, languageCode)
  }
  return date
}

export default Post
