import Box from '@material-ui/core/Box'
import useUserProfile from 'src/hooks/use-user-profile'
import TopBar from 'src/components/top-bar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory} from 'react-router-dom'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import ProfileComponent from './components/profile'

/**
 * @returns {JSX.Element}
 */
function Profile () {
  const userCid = useOwnUserCid()
  const profile = useUserProfile(userCid)
  const history = useHistory()

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography variant='h6'>{profile.displayName}</Typography>
      </TopBar>
      <ProfileComponent userCid={userCid} />
    </div>
  )
}

export default Profile
