import {Fragment, useEffect, useState} from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import RepeatIcon from '@material-ui/icons/Repeat'
import Box from '@material-ui/core/Box'
import {format as formatTimeAgo} from 'timeago.js'
import useLanguageCode from 'src/translations/use-language-code'
import PostMoreMenu from './components/more-menu'
import PostActions from './components/actions'
import {Link as RouterLink, useHistory, useLocation} from 'react-router-dom'
import PropTypes from 'prop-types'
import urlUtils from 'src/lib/utils/url'
import themesUtils from 'src/themes/utils'
import Divider from '@material-ui/core/Divider'
import PostContent from './components/content'
import {forceHttps} from './utils'

const useStyles = makeStyles((theme) => ({
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
  resav3d: {
    // slightly higher placement than the user name seems more pleasing
    marginTop: theme.spacing(-0.25)
  },
  parentPostLine: {
    // center the line
    margin: 'auto',
    width: 2
  },
  userCid: {
    wordBreak: 'break-all',
    // remove added styles from link component
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  displayName: {
    // remove added styles from link component
    color: 'inherit',
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  post: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: themesUtils.scaleRgbaAlpha(theme.palette.action.hover, 0.4)
    },
    // prevent mobile highlight entire post when clicking inner elements
    tapHighlightColor: 'rgba(0, 0, 0, 0)',
    userSelect: 'none'
  }
}))

// note: a single "Post" component can actually be a
// group of posts when it includes a reply or thread
function Posts ({post} = {}) {
  const posts = []
  if (post.parentPost && !post.quotedPost) {
    posts.push(<Post key='parent' isParent={true} post={post.parentPost} />)
  }
  if (post.quotedPost) {
    posts.push(<Post key='quoted' quotingPost={post} isResav3={true} post={post.quotedPost} />)
  }
  else {
    // TODO: use post.isParent temporarily, /post/ view should eventually be
    // refactored to a full width post like twitter instead of just a line
    posts.push(<Post key={post.cid} isParent={post.isParent} post={post} />)
  }
  return <Fragment>{posts}</Fragment>
}

function Post ({post, isParent, isResav3, quotingPost} = {}) {
  const location = useLocation()
  const history = useHistory()
  const languageCode = useLanguageCode()
  const classes = useStyles()
  const date = useDate(post.timestamp, languageCode)

  const encodedUserCid = urlUtils.encodeCid(post.userCid)
  const userProfileUrl = `/profile/${encodedUserCid}`

  const encodedPostCid = urlUtils.encodeCid(post.cid)
  const postUrl = `/post/${encodedPostCid}`
  const navigateToPostUrl = (event) => {
    // don't handle buttons and links
    if (!event.target.tagName.match(/DIV|P/)) {
      return
    }

    // dont click if already on the same post cid
    const [, route, encodedCid] = location.pathname.split('/')
    if (route === 'post') {
      try {
        const currentUrlPostCid = urlUtils.decodeCid(encodedCid)
        if (currentUrlPostCid === post.cid) {
          return
        }
      }
      catch (e) {}
    }

    history.push(postUrl)
  }

  return (
    <Box pt={1.5} className={classes.post} onClick={navigateToPostUrl}>
      {isResav3 && <Resav3dLabel post={post} quotingPost={quotingPost} />}

      <Box px={2} pb={0.5} display='flex'>
        {/* left col avatar */}
        <Box pr={1.5}>
          <Avatar component={RouterLink} to={userProfileUrl} src={post.profile.thumbnailUrl && forceHttps(post.profile.thumbnailUrl)} className={classes.avatar} />
          {isParent && <Divider className={classes.parentPostLine} orientation='vertical' />}
        </Box>

        {/* right col header + content + bottom actions */}
        <Box width='100%'>
          {/* header */}
          <Box display='flex'>
            <Box flexGrow={1}>
              <Box display='flex'>
                {post.profile.displayName && (
                  <Fragment>
                    <Typography className={classes.displayName} component={RouterLink} to={userProfileUrl} variant='subtitle2'>
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
                <Typography component={RouterLink} to={userProfileUrl} variant='caption' color='textSecondary' className={classes.userCid}>
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
          <PostActions post={post} />
        </Box>
      </Box>
    </Box>
  )
}

function Resav3dLabel ({quotingPost} = {}) {
  const theme = useTheme()
  const classes = useStyles()

  const encodedQuoterCid = urlUtils.encodeCid(quotingPost.userCid)
  const encodedQuoterProfileUrl = `/profile/${encodedQuoterCid}`

  return (
    <Box className={classes.resav3d} px={2} pb={0.5} display='flex' alignItems='center'>
      <Box width={theme.spacing(6)} mr={1.5} display='flex' justifyContent='flex-end'>
        <RepeatIcon
          style={{
            // looks better if more on the right
            transform: 'rotate(90deg) translateX(-1px)',
            color: theme.palette.text.secondary,
            fontSize: '1.4rem'
          }}
        />
      </Box>
      <Typography style={{fontWeight: 'bold'}} color='textSecondary' variant='overline' className={classes.userCid} component={RouterLink} to={encodedQuoterProfileUrl}>
        {quotingPost.profile.displayName || quotingPost.userCid.substring(0, 8)} RESAV3D
      </Typography>
    </Box>
  )
}
Resav3dLabel.propTypes = {
  quotingPost: PropTypes.object.isRequired
}

const useDate = (timestamp, languageCode) => {
  const [date, setDate] = useState()
  useEffect(() => {
    const date = formatDate(timestamp, languageCode)
    setDate(date)
  }, [timestamp, languageCode])

  return date
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

export default Posts
