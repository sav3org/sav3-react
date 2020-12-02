import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import ipUtils from 'src/lib/utils/ip'
import assert from 'assert'

const usePeerPosts = (peerCid) => {
  assert(typeof peerCid === 'string')
  const defaultPeerPosts = []
  const [peerPosts, setPeerPosts] = useState(defaultPeerPosts)

  useEffect(() => {
    // TODO
    // setPeerPosts()
  }, [])

  return peerPosts
}

export default usePeerPosts
