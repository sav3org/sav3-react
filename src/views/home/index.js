import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import {useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AvatarDrawerMenuButton from 'src/components/menus/drawer/avatar-button'
import Feed from 'src/components/feeds/posts'
import useFollowingOnce from 'src/hooks/following/use-following-once'
import useUsersPosts from 'src/hooks/use-users-posts'
import PublishPostForm from 'src/components/publish-post/form'
import CircularProgress from '@material-ui/core/CircularProgress'
import useTranslation from 'src/translations/use-translation'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import Divider from '@material-ui/core/Divider'

/**
 * @returns {JSX.Element}
 */
function Home () {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const t = useTranslation()
  const followingCids = useFollowingOnce()
  const ownCid = useOwnUserCid()
  const postsObject = useUsersPosts([ownCid, ...followingCids])
  const posts = []
  for (const postCid in postsObject) {
    posts.push(postsObject[postCid])
  }
  console.log('Home', {followingCids, posts, postsObject})

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
  if (!posts.length && !followingCids.length) {
    feed = (
      <Box width='100%' py={4} display='flex' justifyContent='center' alignItems='center'>
        <Typography variant='body1'>{t['Not following anyone']() + '...'}</Typography>
      </Box>
    )
  }

  return (
    <div>
      <TopBar>
        {fullScreen && (
          <Box pl={2} pr={1}>
            <AvatarDrawerMenuButton />
          </Box>
        )}
        <Box pl={2}>
          <Typography noWrap variant='h6'>
            {t.Home()}
          </Typography>
        </Box>
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

export default Home
