import {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import assert from 'assert'
import useTranslation from 'src/translations/use-translation'
import Button from '@material-ui/core/Button'
import useIsFollowing from 'src/hooks/use-is-following'
import followManager from 'src/lib/follow-manager'

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
    wordBreak: 'break-all'
  }
}))

// same height as the 3 dots button of the post component
const buttonHeight = 48

/**
 * @param {object} props
 * @param {string} props.user
 * @returns {JSX.Element}
 */
function User ({user} = {}) {
  const classes = useStyles()
  const t = useTranslation()
  const followManagerIsFollowing = useIsFollowing(user.cid)
  const [isFollowing, setIsFollowing] = useState()

  const handleFollow = () => {
    followManager.addFollowing(user.cid)
    setIsFollowing(true)
  }

  const handleUnfollow = () => {
    followManager.deleteFollowing(user.cid)
    setIsFollowing(false)
  }

  let followButton
  if (followManagerIsFollowing === false || isFollowing === false) {
    followButton = (
      <Button variant='outlined' size='small' color='primary' onClick={handleFollow}>
        {t.Follow()}
      </Button>
    )
  }
  else if (followManagerIsFollowing === true) {
    followButton = (
      <Button variant='outlined' size='small' color='primary' onClick={handleUnfollow}>
        {t.Unfollow()}
      </Button>
    )
  }

  console.log({isFollowing, followManagerIsFollowing})

  return (
    <div>
      <Box px={2} py={1.5} display='flex'>
        {/* left col avatar */}
        <Box pr={1.5}>
          <Avatar src={user.thumbnailUrl && forceHttps(user.thumbnailUrl)} className={classes.avatar} />
        </Box>

        {/* right col header + content + bottom actions */}
        <Box width='100%'>
          {/* header */}
          <Box display='flex'>
            <Box flexGrow={1}>
              <Box display='flex'>
                <Typography variant='subtitle2'>{user.displayName}</Typography>
              </Box>
              <Box>
                <Typography variant='caption' color='textSecondary' className={classes.userCid}>
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
