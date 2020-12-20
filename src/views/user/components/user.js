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
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import Description from './description'

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
 * @param {object} props
 * @param {string} props.userCid
 * @returns {JSX.Element}
 */
function User ({userCid} = {}) {
  const classes = useStyles()
  const posts = useUserPosts(userCid)
  const profile = useUserProfile(userCid)
  const t = useTranslation()

  console.log('User', {userCid, posts, profile})

  let description = profile.description || ''
  if (description && description.length > 140) {
    description = description.substring(0, 140)
  }

  const emptyImage = 'data:image/png;base64,'

  const handleFollow = () => {}

  return (
    <div className={classes.root}>
      <CardMedia className={classes.banner} image={profile.bannerUrl || emptyImage} />
      <Avatar src={profile.thumbnailUrl} className={classes.avatar} />
      <Box p={2} pb={0} display='flex' flexDirection='row-reverse'>
        <Button variant='outlined' size='large' color='primary' onClick={handleFollow}>
          {t.Follow()}
        </Button>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <CardHeader className={classes.displayName} pb={0} title={profile.displayName} subheader={userCid} />
      <Box p={2} pt={0}>
        <Description description={description} />
      </Box>
      <Feed posts={posts} />
    </div>
  )
}

User.propTypes = {
  userCid: PropTypes.string.isRequired
}

export default User
