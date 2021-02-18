import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Avatar from '@material-ui/core/Avatar'
import useTranslation from 'src/translations/use-translation'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import PostsFeed from 'src/components/feeds/posts'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import useUserProfile from 'src/hooks/user/use-user-profile'
import PropTypes from 'prop-types'
import Description from './description'
import EditProfileModal from './edit-profile-modal'
import assert from 'assert'
import Divider from '@material-ui/core/Divider'
import useIsFollowing from 'src/hooks/following/use-is-following'
import MoreMenuButton from './more-menu'
import useUserFeedPosts from 'src/hooks/feed/use-user-posts'
import Debug from 'debug'
const debug = Debug('sav3:views:profile')

const emptyImage = 'data:image/png;base64,'

const useStyles = makeStyles((theme) => ({
  banner: {
    paddingTop: '33.25%' // approximately 200px height
  },
  avatar: {
    position: 'absolute',
    // make avatar 25% of the middle col
    width: theme.sav3.layout.columns.middle.width.md / 4,
    height: theme.sav3.layout.columns.middle.width.md / 4,
    marginTop: theme.sav3.layout.columns.middle.width.md / -8,
    marginLeft: theme.spacing(2),
    borderWidth: theme.spacing(0.5),
    borderStyle: 'solid',
    borderColor: theme.palette.background.default,
    [theme.breakpoints.down(theme.sav3.layout.columns.middle.width.md)]: {
      width: '25vw',
      height: '25vw',
      marginTop: '-12.5vw',
      borderWidth: theme.spacing(0.25)
    }
  },
  displayName: {
    wordBreak: 'break-all'
  }
}))

function Profile ({userCid} = {}) {
  const ownCid = useOwnUserCid()
  const classes = useStyles()
  const profile = useUserProfile(userCid)
  const {posts, next, hasMore} = useUserFeedPosts(userCid)

  debug({ownCid, userCid, posts, profile})

  let button
  if (userCid === ownCid) {
    button = <EditProfileButton profile={profile} />
  }
  // dont show button if dont know own cid yet
  else if (ownCid) {
    button = <FollowButton userCid={userCid} />
  }

  let description = profile.description || ''
  if (description && description.length > 140) {
    description = description.substring(0, 140)
  }

  return (
    <div className={classes.root}>
      <CardMedia className={classes.banner} image={(profile.bannerUrl && forceHttps(profile.bannerUrl)) || emptyImage} />
      <Avatar src={profile.thumbnailUrl && forceHttps(profile.thumbnailUrl)} className={classes.avatar} />
      <Box p={2} pb={0} display='flex' flexDirection='row-reverse'>
        {button}
        <MoreMenuButton userCid={userCid} />
      </Box>
      <CardHeader className={classes.displayName} pb={0} title={profile.displayName} subheader={userCid} />
      <Box p={2} pt={0}>
        <Description description={description} />
      </Box>
      <Divider />
      <PostsFeed posts={posts} next={next} hasMore={hasMore} />
    </div>
  )
}

Profile.propTypes = {
  userCid: PropTypes.string.isRequired
}

function EditProfileButton ({profile}) {
  const t = useTranslation()
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false)
  return (
    <div>
      <Button variant='outlined' size='large' color='primary' onClick={() => setOpenEditProfileModal(true)}>
        {t['Edit profile']()}
      </Button>
      <EditProfileModal previousProfile={profile} open={openEditProfileModal} onClose={() => setOpenEditProfileModal(false)} />
    </div>
  )
}

function FollowButton ({userCid} = {}) {
  const t = useTranslation()
  const [isFollowing, setIsFollowing] = useIsFollowing(userCid)

  const follow = (value) => {
    // still show button even if cid hasn't loaded yet but don't follow
    if (!userCid) {
      return
    }
    setIsFollowing(value)
  }

  let followButton = (
    <Button variant='outlined' size='large' color='primary' onClick={() => follow(true)}>
      {t.Follow()}
    </Button>
  )
  if (isFollowing) {
    followButton = (
      <Button variant='outlined' size='large' color='primary' onClick={() => follow(false)}>
        {t.Unfollow()}
      </Button>
    )
  }
  return followButton
}

FollowButton.propTypes = {
  userCid: PropTypes.string
}

export const forceHttps = (link) => {
  assert(typeof link === 'string', `forceHttps link '${link}' not a string`)
  link = link.trim()
  // has no http/https
  if (!link.match(/^https?:\/\//)) {
    link = `https://${link}`
  }
  else {
    // force https if http
    link = link.replace(/^http:\/\//, 'https://')
  }
  return link
}

export default Profile
