import Box from '@material-ui/core/Box'
import useUserProfile from 'src/hooks/use-user-profile'
import TopBar from 'src/components/top-bar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory} from 'react-router-dom'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import ProfileComponent from './components/profile'
import useTranslation from 'src/translations/use-translation'

/**
 * @returns {JSX.Element}
 */
function Profile () {
  const userCid = useOwnUserCid()
  const profile = useUserProfile(userCid)
  const history = useHistory()
  const t = useTranslation()

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography noWrap variant='h6'>
          {profile.displayName || t['Edit profile']()}
        </Typography>
      </TopBar>
      <ProfileComponent userCid={userCid} />
    </div>
  )
}

export default Profile
