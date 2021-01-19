import {useContext} from 'react'
import {FeedContext} from './feed-provider'

const useHomePosts = () => {
  const {posts, profiles, homePostCids} = useContext(FeedContext)
  const homePosts = []

  for (const homePostCid of homePostCids) {
    if (!posts[homePostCid]) {
      continue
    }
    homePosts.push({...posts[homePostCid], profile: profiles[posts[homePostCid].userCid] || {}})
  }

  return homePosts
}

export default useHomePosts
