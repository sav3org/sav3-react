import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import usePosts from 'src/hooks/post/use-posts'
import usePostReplyCids from 'src/hooks/post/use-post-reply-cids'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-post-with-replies')

// TODO: delete this hook after refactoring the /post/ feed, fetching replies with post is probably a bad design

const usePostWithReplies = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [parentPost, setParentPost] = useState()
  const replyCids = usePostReplyCids(parentPost && parentPost.cid)
  const posts = usePosts(replyCids)

  // usePosts doesn't delete removed replies on replyCids change
  // but usePostReplyCids does so must assign like below
  const replies = {}
  for (const replyCid of replyCids) {
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

      const quotedPostCid = parentPost.quotedPostCid
      if (quotedPostCid) {
        sav3Ipfs.getPost(quotedPostCid).then((quotedPost) => setParentPost((post) => ({...post, quotedPost})))
      }
    })()
  }, [postCid])

  debug({parentPost, replyCids, replies})

  if (!parentPost) {
    return
  }

  return {...parentPost, replies}
}

export default usePostWithReplies
