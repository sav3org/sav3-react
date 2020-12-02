import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import ipUtils from 'src/lib/utils/ip'
import assert from 'assert'
import usePeerPosts from './use-peer-posts'

const usePeersPosts = (peersCids) => {
  assert(Array.isArray(peersCids))
  const defaultPeersPosts = peersCids.map((cid) => [])
  console.log({peersCids, defaultPeersPosts})
  const [peersPosts, setPeersPosts] = useState(defaultPeersPosts)

  const [pollCount, setPollCount] = useState(0)

  const pollTime = 1000
  useEffect(() => {
    const interval = setInterval(() => {
      setPollCount(pollCount + 1)
    }, pollTime)
  }, [])

  useEffect(() => {
    if (!peersCids.length) {
      console.log('no peers cids')
      return
    }

    let isMounted = true
    sav3Ipfs.getUserPosts(peersCids[0]).then((posts) => {
      // dont set state if component is no longer mounted
      if (!isMounted) {
        console.log('not mounted', {posts})
        return
      }

      const newPeersPosts = JSON.parse(JSON.stringify(peersPosts))
      newPeersPosts[0] = posts
      setPeersPosts(newPeersPosts)
    })

    return () => {
      isMounted = false
    }
  }, [JSON.stringify(peersCids), pollCount])

  return peersPosts
}

export default usePeersPosts
