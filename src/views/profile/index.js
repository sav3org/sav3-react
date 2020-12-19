import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Avatar from '@material-ui/core/Avatar'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import useTranslation from 'src/translations/use-translation'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Feed from 'src/components/feed'
import useUserPosts from 'src/hooks/use-user-posts'
import useUserProfile from 'src/hooks/use-user-profile'
import TopBar from 'src/components/top-bar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory} from 'react-router-dom'
import EditProfileModal from './components/edit-profile-modal'
import useOwnPeerCid from 'src/hooks/use-own-peer-cid'

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

/**
 * @returns {JSX.Element}
 */
function Profile () {
  const userCid = useOwnPeerCid()
  const classes = useStyles()
  const posts = useUserPosts(userCid)
  const profile = useUserProfile(userCid)
  const history = useHistory()

  console.log('Profile', {userCid, posts, profile})

  let description = profile.description
  if (description && description.length > 140) {
    description = description.substring(0, 140)
  }

  const emptyImage = 'data:image/png;base64,'

  return (
    <div className={classes.root}>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography variant='h6'>{profile.displayName}</Typography>
      </TopBar>
      <CardMedia className={classes.banner} image={profile.bannerUrl || emptyImage} />
      <Avatar src={profile.thumbnailUrl} className={classes.avatar} />
      <Box p={2} pb={0} display='flex' flexDirection='row-reverse'>
        <EditProfileButton profile={profile} />
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <CardHeader className={classes.displayName} pb={0} title={profile.displayName} subheader={userCid} />
      <Box p={2} pt={0}>
        <Typography variant='body2'>{description}</Typography>
      </Box>

      <Feed posts={posts} />
    </div>
  )
}

/**
 * @param {object} props
 * @param {object} props.profile
 * @returns {JSX.Element}
 */
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

export default Profile
