import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-post')

const usePost = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [post, setPost] = useState()

  useEffect(() => {
    // reset on post cid change
    if (post) {
      setPost()
    }
    if (!postCid || typeof postCid !== 'string') {
      return
    }
    ;(async () => {
      const post = await sav3Ipfs.getPost(postCid)
      setPost(post)

      const parentPostCid = post.parentPostCid
      const quotedPostCid = post.quotedPostCid
      if (parentPostCid) {
        sav3Ipfs.getPost(parentPostCid).then((parentPost) => setPost((post) => ({...post, parentPost})))
      }
      if (quotedPostCid) {
        sav3Ipfs.getPost(quotedPostCid).then((quotedPost) => setPost((post) => ({...post, quotedPost})))
      }
    })()
  }, [postCid])

  debug({post})
  return post
}

export default usePost
