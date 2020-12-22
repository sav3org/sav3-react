import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import useTranslation from 'src/translations/use-translation'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import {useHistory} from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Typography from '@material-ui/core/Typography'
import usePeersStats from 'src/hooks/use-peers-stats'
import CircularProgress from '@material-ui/core/CircularProgress'
import useFollowingOnce from 'src/hooks/following/use-following-once'
import useUsersProfiles from 'src/hooks/use-users-profiles'
import UsersFeed from 'src/components/feeds/users'

/**
 * @returns {JSX.Element}
 */
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

  console.log('Following', {followingCids, profiles, users})

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
      <UsersFeed users={users} />
    </div>
  )
}

export default Following
