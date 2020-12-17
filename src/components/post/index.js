import React from 'react'
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

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
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
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const date = formatDate(post.timestamp, languageCode)

  return (
    <div>
      <Box px={2} py={1.5} display='flex'>
        {/* left col avatar */}
        <Box pr={1.5}>
          <Avatar src={post.profile.thumbnailUrl} className={classes.avatar} />
        </Box>

        {/* right col header + content + bottom actions */}
        <Box width='100%'>
          {/* header */}
          <Box display='flex'>
            <Box flexGrow={1}>
              <Box display='flex'>
                <Typography variant='subtitle2'>{post.profile.displayName}</Typography>
                &nbsp;
                <Typography variant='subtitle2'>·</Typography>
                &nbsp;
                <Typography variant='subtitle2'>{date}</Typography>
              </Box>
              <Box>
                <Typography variant='caption' color='textSecondary' className={classes.userCid}>
                  {post.userCid}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
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
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.</Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8
                minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring
                often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more.
                (Discard any mussels that don’t open.)
              </Typography>
              <Typography>Set aside off of the heat to let rest for 10 minutes, and then serve.</Typography>
            </CardContent>
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
  const link = getPostContentLink(content)
  const mediaSrc = getPostContentMediaSrc(content)

  if (link) {
    const [contentPart1, contentPart2] = content.split(link)
    let href = link
    if (!link.match(/$https?:\/\//)) {
      href = `https://${link}`
    }
    content = []
    if (contentPart1) {
      content.push(contentPart1)
    }
    content.push(
      <Link variant='body2' href={href} target='_blank' rel='noopener'>
        {link}
      </Link>
    )
    if (contentPart2) {
      content.push(contentPart2)
    }
  }

  const media = mediaSrc && (
    <Box pt={1}>
      <Card variant='outlined'>
        <CardMedia className={classes.media} image={mediaSrc} />
      </Card>
    </Box>
  )

  return (
    <Box>
      <Typography variant='body2'>{content}</Typography>
      {media}
    </Box>
  )
}

// only use the first link in a post
const getPostContentLink = (content) => {
  if (!content) {
    return
  }
  assert(typeof content === 'string')
  const links = content.match(urlRegex({strict: false}))
  return links && links[0]
}

const getPostContentMediaSrc = (content) => {
  if (!content) {
    return
  }
  assert(typeof content === 'string')
  const links = content.match(urlRegex({strict: false}))
  let link = links && links[0]
  if (!link) {
    return
  }
  if (linkIsMedia(link)) {
    if (!link.match(/$https?:\/\//)) {
      link = `https://${link}`
    }
    return link
  }
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
