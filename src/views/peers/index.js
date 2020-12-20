import {useState} from 'react'
import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import {useTheme, makeStyles} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTranslation from 'src/translations/use-translation'
import User from 'src/views/user/components/user'
import isIpfs from 'is-ipfs'
import IconButton from '@material-ui/core/IconButton'
import {useHistory} from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Typography from '@material-ui/core/Typography'
import Feed from 'src/components/feed'
import usePeersCids from 'src/hooks/use-peers-cids'
import useUsersIpnsData from 'src/hooks/use-users-ipns-data'
import useUsersPosts from 'src/hooks/use-users-posts'
import useUsersProfiles from 'src/hooks/use-users-profiles'

const useStyles = makeStyles((theme) => ({
  search: {
    height: theme.sav3.topBar.height / 1.5,
    '& fieldset': {
      border: 'none',
      backgroundColor: theme.palette.divider
    }
  }
}))

/**
 * @returns {JSX.Element}
 */
function Peers () {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const t = useTranslation()
  const history = useHistory()

  const peersCids = usePeersCids()
  const usersIpnsData = useUsersIpnsData(peersCids)
  const profiles = useUsersProfiles(peersCids)
  const postsObject = useUsersPosts(peersCids)
  const posts = []
  for (const postCid in postsObject) {
    posts.push(postsObject[postCid])
  }
  console.log({peersCids, usersIpnsData, posts, postsObject, profiles})

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography variant='h6'>Connected peers</Typography>
      </TopBar>
      <Feed posts={posts} />
    </div>
  )
}

export default Peers
