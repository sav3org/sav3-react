import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'

const usePosts = (postCids) => {
  assert(Array.isArray(postCids), `invalid postCids '${JSON.stringify(postCids)}'`)
  const defaultPosts = {}
  const [posts, setPosts] = useState(defaultPosts)
  console.log('usePosts', {postCids, posts})

  useEffect(() => {
    if (!postCids.length) {
      if (JSON.stringify(posts) !== JSON.stringify(defaultPosts)) {
        setPosts(defaultPosts)
      }
      return
    }
    for (const postCid of postCids) {
      if (!postCid || typeof postCid !== 'string') {
        continue
      }

      sav3Ipfs.getPost(postCid).then((post) => {
        setPosts((previousPosts) => ({
          ...previousPosts,
          [postCid]: post
        }))
      })
    }
  }, [JSON.stringify(postCids)])

  return posts
}

export default usePosts
