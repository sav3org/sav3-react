import Box from '@material-ui/core/Box'
import useUsersProfiles from 'src/hooks/use-users-profiles'
import TopBar from 'src/components/top-bar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ArrowBack from '@material-ui/icons/ArrowBack'
import {useHistory, useParams} from 'react-router-dom'
import usePostWithReplies from 'src/hooks/use-post-with-replies'
import useTranslation from 'src/translations/use-translation'
import Feed from 'src/components/feeds/posts'
import urlUtils from 'src/lib/utils/url'
import CircularProgress from '@material-ui/core/CircularProgress'
import useParentPostsWithProfiles from 'src/hooks/use-parent-posts-with-profiles'
import Debug from 'debug'
const debug = Debug('sav3:views:post')

function Post () {
  const {encodedCid} = useParams()
  const urlIsExpired = encodedCid && urlUtils.encodedCidIsExpired(encodedCid)
  let postCid
  if (!urlIsExpired && encodedCid) {
    postCid = urlUtils.decodeCid(encodedCid)
  }

  const postWithReplies = usePostWithReplies(postCid)
  const parentPostsObject = useParentPostsWithProfiles(postWithReplies ? [postWithReplies] : [])

  const history = useHistory()
  const t = useTranslation()

  // get posts
  const posts = []
  if (postWithReplies) {
    posts.push(postWithReplies)
    for (const i in postWithReplies.replies) {
      if (!postWithReplies.replies[i]) {
        continue
      }
      posts.push(postWithReplies.replies[i])
    }
  }

  // TODO: use post.isParent temporarily, /post/ view should eventually be
  // refactored to a full width post like twitter instead of just a line
  if (posts.length > 1) {
    posts[0] = {...posts[0], isParent: true}
  }

  // add parent parent post if parent post is a reply
  if (parentPostsObject[posts[0] && posts[0].parentPostCid]) {
    posts[0] = {...posts[0], parentPost: parentPostsObject[posts[0].parentPostCid]}
  }

  // get profiles
  const userCids = new Set()
  for (const post of posts) {
    userCids.add(post.userCid)
  }
  const profiles = useUsersProfiles([...userCids])

  // add profiles to posts
  for (const post of posts) {
    post.profile = profiles[post.userCid] || {}
  }

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
  if (urlIsExpired) {
    feed = (
      <Box width='100%' py={4} display='flex' justifyContent='center' alignItems='center'>
        <Typography variant='body1'>{t['URL expired']() + '.'}</Typography>
      </Box>
    )
  }

  debug({postCid, postWithReplies, posts})

  return (
    <div>
      <TopBar>
        <Box pr={1}>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Typography noWrap variant='h6'>
          {t.Post()}
        </Typography>
      </TopBar>
      {feed}
    </div>
  )
}

export default Post
