import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import useTranslation from 'src/translations/use-translation'
import IconButton from '@material-ui/core/IconButton'
import {useHistory} from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Typography from '@material-ui/core/Typography'
import useFollowingOnce from 'src/hooks/following/use-following-once'
import useUsersProfiles from 'src/hooks/user/use-users-profiles'
import UsersFeed from 'src/components/feeds/users'
import Debug from 'debug'
const debug = Debug('sav3:views:following')

function Following () {
  const t = useTranslation()
  const history = useHistory()

  const followingCids = useFollowingOnce()
  const profiles = useUsersProfiles(followingCids)
  const users = []
  for (const userCid of followingCids) {
    const user = profiles[userCid] || {}
    user.cid = userCid
    users.push(user)
  }

  let feed = <UsersFeed users={users} />
  if (!users.length) {
    feed = (
      <Box width='100%' py={4} display='flex' justifyContent='center' alignItems='center'>
        <Typography variant='body1'>{t['Not following anyone']() + '...'}</Typography>
      </Box>
    )
  }

  debug({followingCids, profiles, users})

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography noWrap variant='h6'>
          {t.Following()}
        </Typography>
      </TopBar>
      {feed}
    </div>
  )
}

export default Following
