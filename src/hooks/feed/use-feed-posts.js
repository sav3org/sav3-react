import {useContext} from 'react'
import {FeedContext} from './feed-provider'

const useFeedPosts = () => {
  const {posts, profiles, feedPostCids} = useContext(FeedContext)
  const feedPosts = []

  for (const feedPostCid of feedPostCids) {
    if (!posts[feedPostCid]) {
      continue
    }
    feedPosts.push(posts[feedPostCid])
  }

  return feedPosts
}

export default useFeedPosts
