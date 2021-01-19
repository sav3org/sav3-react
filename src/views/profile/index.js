import Box from '@material-ui/core/Box'
import useUserProfile from 'src/hooks/use-user-profile'
import TopBar from 'src/components/top-bar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory, useParams} from 'react-router-dom'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import ProfileComponent from './components/profile'
import useTranslation from 'src/translations/use-translation'
import urlUtils from 'src/lib/utils/url'
import Debug from 'debug'
const debug = Debug('sav3:views:profile')

function Profile () {
  const {encodedCid} = useParams()
  const urlIsExpired = encodedCid && urlUtils.encodedCidIsExpired(encodedCid)
  let urlUserCid
  if (!urlIsExpired && encodedCid) {
    urlUserCid = urlUtils.decodeCid(encodedCid)
  }

  const isOwnProfile = !encodedCid
  const ownCid = useOwnUserCid()

  let userCid
  if (isOwnProfile) {
    userCid = ownCid
  }
  else {
    userCid = urlUserCid
  }

  const profile = useUserProfile(userCid)
  const history = useHistory()
  const t = useTranslation()

  debug({userCid, urlUserCid, urlIsExpired, isOwnProfile})

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography noWrap variant='h6'>
          {profile.displayName || (isOwnProfile && t['Edit profile']())}
        </Typography>
      </TopBar>
      {urlIsExpired && (
        <Box width='100%' py={4} display='flex' justifyContent='center' alignItems='center'>
          <Typography variant='body1'>{t['URL expired']() + '.'}</Typography>
        </Box>
      )}
      {!urlIsExpired && <ProfileComponent userCid={userCid} />}
    </div>
  )
}

export default Profile
