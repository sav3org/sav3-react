import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import usePosts from 'src/hooks/use-posts'
import usePostRepliesCids from 'src/hooks/use-post-replies-cids'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-post-with-replies')

const usePostWithReplies = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [parentPost, setParentPost] = useState()
  const repliesCids = usePostRepliesCids(parentPost && parentPost.cid)
  const posts = usePosts(repliesCids)

  // usePosts doesn't delete removed replies on repliesCids change
  // but usePostRepliesCids does so must assign like below
  const replies = {}
  for (const replyCid of repliesCids) {
    replies[replyCid] = posts[replyCid]
  }

  // set parent post once
  useEffect(() => {
    // reset on post cid change
    if (parentPost) {
      setParentPost()
    }
    if (!postCid || typeof postCid !== 'string') {
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

  debug({parentPost, repliesCids, replies})

  if (!parentPost) {
    return
  }

  return {...parentPost, replies}
}

export default usePostWithReplies
