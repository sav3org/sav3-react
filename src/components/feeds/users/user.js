import {makeStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import assert from 'assert'
import useTranslation from 'src/translations/use-translation'
import Button from '@material-ui/core/Button'
import useIsFollowing from 'src/hooks/following/use-is-following'
import {Link as RouterLink} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  avatar: {
    // slightly higher placement than the user name seems more pleasing
    marginTop: theme.spacing(-0.25),
    width: theme.spacing(6),
    height: theme.spacing(6),
    // borders
    borderWidth: theme.sav3.borderWidth,
    borderStyle: 'solid',
    borderColor: theme.sav3.borderColor,
    backgroundColor: theme.palette.background.default
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
  }
}))

// same height as the 3 dots button of the post component
const buttonHeight = 48

function User ({user} = {}) {
  const classes = useStyles()
  const t = useTranslation()
  const [isFollowing, setIsFollowing] = useIsFollowing(user.cid)

  let followButton = (
    <Button variant='outlined' size='small' color='primary' onClick={() => setIsFollowing(true)}>
      {t.Follow()}
    </Button>
  )
  if (isFollowing) {
    followButton = (
      <Button variant='outlined' size='small' color='primary' onClick={() => setIsFollowing(false)}>
        {t.Unfollow()}
      </Button>
    )
  }

  return (
    <div>
      <Box px={2} py={1.5} display='flex'>
        {/* left col avatar */}
        <Box pr={1.5}>
          <Avatar component={RouterLink} to={{pathname: '/profile', state: {userCid: user.cid}}} src={user.thumbnailUrl && forceHttps(user.thumbnailUrl)} className={classes.avatar} />
        </Box>

        {/* right col header + content + bottom actions */}
        <Box width='100%'>
          {/* header */}
          <Box display='flex'>
            <Box flexGrow={1}>
              <Box display='flex'>
                <Typography className={classes.displayName} component={RouterLink} to={{pathname: '/profile', state: {userCid: user.cid}}} variant='subtitle2'>
                  {user.displayName}
                </Typography>
              </Box>
              <Box>
                <Typography component={RouterLink} to={{pathname: '/profile', state: {userCid: user.cid}}} variant='caption' color='textSecondary' className={classes.userCid}>
                  {user.cid}
                </Typography>
              </Box>
            </Box>
            <Box height={buttonHeight}>{followButton}</Box>
          </Box>

          {/* content */}
          <Typography variant='body2'>{user.description}</Typography>
        </Box>
      </Box>
    </div>
  )
}

const forceHttps = (link) => {
  assert(typeof link === 'string', `forceHttps link '${link}' not a string`)
  link = link.trim()
  link = link.replace(/^http:\/\//, 'https://')
  return link
}

export default User
