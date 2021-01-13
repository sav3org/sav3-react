import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import usePosts from 'src/hooks/use-posts'
import usePostRepliesCids from 'src/hooks/use-post-replies-cids'

const usePostWithReplies = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [parentPost, setParentPost] = useState()
  const repliesCids = usePostRepliesCids(parentPost && parentPost.cid)
  const replies = usePosts(repliesCids)

  // set parent post once
  useEffect(() => {
    if (!postCid || typeof postCid !== 'string') {
      if (parentPost) {
        setParentPost()
      }
      return
    }
    ;(async () => {
      const post = await sav3Ipfs.getPost(postCid)
      let parentPost = post
      if (post.parentPostCid) {
        parentPost = await sav3Ipfs.getPost(post.parentPostCid)
      }
      setParentPost(parentPost)
    })()
  }, [postCid])

  console.log('usePostWithReplies', {parentPost, repliesCids, replies})

  if (!parentPost) {
    return
  }

  return {...parentPost, replies}
}

export default usePostWithReplies
