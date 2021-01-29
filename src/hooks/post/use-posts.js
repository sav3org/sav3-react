import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import usePrevious from 'src/hooks/utils/use-previous'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-posts')

const usePosts = (postCids) => {
  assert(Array.isArray(postCids), `invalid postCids '${JSON.stringify(postCids)}'`)
  const defaultPosts = {}
  const [posts, setPosts] = useState(defaultPosts)
  debug({postCids, posts})

  const postCidsSet = new Set(postCids)
  const previousPostCidsSet = usePrevious(postCidsSet)

  const setPost = (postCid, post) => setPosts((previousPosts) => ({...previousPosts, [postCid]: post}))

  useEffect(() => {
    // dont reset to default on profile cids change because
    // even if extra profiles are kept it doesn't affect
    // any functionalities yet

    // reset posts object post cids are empty
    if (!postCids.length) {
      if (JSON.stringify(posts) !== JSON.stringify(defaultPosts)) {
        setPosts(defaultPosts)
      }
      return
    }

    for (const postCid of postCidsSet) {
      assert(postCid && typeof postCid === 'string', `usePosts invalid postCid '${postCid}' in '${JSON.stringify(postCids)}'`)
      // get post already pending
      if (previousPostCidsSet && previousPostCidsSet.has(postCid)) {
        continue
      }

      // fetch main post, then fetch related posts like parent and quoted if any
      // if post has reply or quoted, don't set it yet until the reply or quote is
      // fetched, otherwise you don't get any context for the post
      sav3Ipfs.getPost(postCid).then((post) => {
        const parentPostCid = post.parentPostCid
        const quotedPostCid = post.quotedPostCid
        if (quotedPostCid && !posts[quotedPostCid]) {
          sav3Ipfs.getPost(quotedPostCid).then((quotedPost) => {
            setPost(postCid, post)
            setPost(quotedPostCid, quotedPost)
          })
        }
        else if (parentPostCid && !posts[parentPostCid]) {
          sav3Ipfs.getPost(parentPostCid).then((parentPost) => {
            setPost(postCid, post)
            setPost(parentPostCid, parentPost)
          })
        }
        else {
          setPost(postCid, post)
        }
      })
    }
  }, [JSON.stringify(postCids)])

  return posts
}

export default usePosts
