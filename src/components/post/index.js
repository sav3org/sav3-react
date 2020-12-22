import {Fragment, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'
import {format as formatTimeAgo} from 'timeago.js'
import useLanguageCode from 'src/translations/use-language-code'
import assert from 'assert'
import urlRegex from 'url-regex'
import PostMoreMenu from './more-menu'

const useStyles = makeStyles((theme) => ({
  root: {},
  imgMedia: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
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
    wordBreak: 'break-all'
  }
}))

/**
 * @param {object} props
 * @param {string} props.post
 * @returns {JSX.Element}
 */
function Post ({post} = {}) {
  const languageCode = useLanguageCode()
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const date = formatDate(post.timestamp, languageCode)

  return (
    <div>
      <Box px={2} py={1.5} display='flex'>
        {/* left col avatar */}
        <Box pr={1.5}>
          <Avatar src={post.profile.thumbnailUrl && forceHttps(post.profile.thumbnailUrl)} className={classes.avatar} />
        </Box>

        {/* right col header + content + bottom actions */}
        <Box width='100%'>
          {/* header */}
          <Box display='flex'>
            <Box flexGrow={1}>
              <Box display='flex'>
                {post.profile.displayName && (
                  <Fragment>
                    <Typography variant='subtitle2'>{post.profile.displayName}</Typography>
                    &nbsp;
                    <Typography variant='subtitle2'>·</Typography>
                    &nbsp;
                  </Fragment>
                )}
                <Typography variant='subtitle2'>{date}</Typography>
              </Box>
              <Box>
                <Typography variant='caption' color='textSecondary' className={classes.userCid}>
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
          <CardActions disableSpacing>
            <IconButton aria-label='add to favorites'>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label='share'>
              <ShareIcon />
            </IconButton>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <CardContent></CardContent>
          </Collapse>
        </Box>
      </Box>
    </div>
  )
}

/**
 * @param {object} props
 * @param {string} props.content
 * @returns {JSX.Element}
 */
function PostContent ({content} = {}) {
  const classes = useStyles()
  let contentComponents = [content]

  const link = getPostContentLink(content)
  if (link) {
    const [contentPart1, contentPart2] = content.split(link)
    let href = link
    if (!link.match(/$https?:\/\//)) {
      href = `https://${link}`
    }
    contentComponents = []
    if (contentPart1) {
      contentComponents.push(contentPart1)
    }
    contentComponents.push(
      <Link key='content link' variant='body2' href={href} target='_blank' rel='noopener'>
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
