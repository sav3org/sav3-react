import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import {useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AvatarDrawerMenuButton from 'src/components/menus/drawer/avatar-button'
import PostsFeed from 'src/components/feeds/posts'
import useFollowingOnce from 'src/hooks/following/use-following-once'
import PublishPostForm from 'src/components/publish-post/form'
import CircularProgress from '@material-ui/core/CircularProgress'
import useTranslation from 'src/translations/use-translation'
import useFeedPosts from 'src/hooks/feed/use-feed-posts'
import Divider from '@material-ui/core/Divider'
import Debug from 'debug'
const debug = Debug('sav3:views:feed')

function Feed () {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const t = useTranslation()
  const followingCids = useFollowingOnce()
  const {posts, next, hasMore} = useFeedPosts()
  debug({posts})

  let feed = <PostsFeed posts={posts} next={next} hasMore={hasMore} />
  if (!posts.length) {
    feed = (
      <Box width='100%' py={4} display='flex' justifyContent='center' alignItems='center'>
        <CircularProgress size={24} />
        <Box p={0.5} />
        <Typography variant='body1'>{t['Connecting to peers']() + '...'}</Typography>
      </Box>
    )
  }

  // less than 2 to include own cid
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
            {t.Feed()}
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

export default Feed
