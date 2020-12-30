import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import {useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTranslation from 'src/translations/use-translation'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import {useHistory} from 'react-router-dom'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Typography from '@material-ui/core/Typography'
import Feed from 'src/components/feeds/posts'
import usePeersCids from 'src/hooks/use-peers-cids'
import useUsersPosts from 'src/hooks/use-users-posts'
import PublishPostForm from 'src/components/publish-post/form'
import CircularProgress from '@material-ui/core/CircularProgress'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
/**
 * @returns {JSX.Element}
 */
function Peers () {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const t = useTranslation()
  const history = useHistory()

  let peersCids = usePeersCids()
  const ownCid = useOwnUserCid()
  if (ownCid) {
    peersCids = [ownCid, ...peersCids]
  }
  const postsObject = useUsersPosts(peersCids)
  const posts = []
  for (const postCid in postsObject) {
    posts.push(postsObject[postCid])
  }
  console.log('Peers', {peersCids, posts, postsObject})

  let feed = <Feed posts={posts} />
  if (!posts.length) {
    feed = (
      <Box width='100%' py={4} display='flex' justifyContent='center' alignItems='center'>
        <CircularProgress size={24} />
        <Box p={0.5} />
        <Typography variant='body1'>{t['Connecting to peers']() + '...'}</Typography>
      </Box>
    )
  }

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography noWrap variant='h6'>
          {t['Connected peers posts']()}
        </Typography>
      </TopBar>
      {!fullScreen && (
        <div>
          <Box pb={1}>
            <PublishPostForm />
            <Divider />
          </Box>
          <Divider />
        </div>
      )}
      {feed}
    </div>
  )
}

export default Peers
