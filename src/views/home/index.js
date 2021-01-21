import Box from '@material-ui/core/Box'
import TopBar from 'src/components/top-bar'
import Typography from '@material-ui/core/Typography'
import {useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AvatarDrawerMenuButton from 'src/components/menus/drawer/avatar-button'
import Feed from 'src/components/feeds/posts'
import PublishPostForm from 'src/components/publish-post/form'
import CircularProgress from '@material-ui/core/CircularProgress'
import useTranslation from 'src/translations/use-translation'
import useHomePosts from 'src/hooks/feed/use-home-posts'
import Divider from '@material-ui/core/Divider'
import Debug from 'debug'
const debug = Debug('sav3:views:home')

function Home () {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const t = useTranslation()
  const {posts, next, hasMore} = useHomePosts()
  debug({posts})

  let feed = <Feed posts={posts} next={next} hasMore={hasMore} />
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
