import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import ipUtils from 'src/lib/utils/ip'

const usePeersCids = () => {
  const [peerCids, setPeersCids] = useState([])
  const [pollCount, setPollCount] = useState(0)

  const pollTime = 5000 // if too fast will break the peer posts demo
  useEffect(() => {
    const interval = setInterval(() => {
      setPollCount(pollCount + 1)
    }, pollTime)

    // return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    ;(async () => {
      const peerCids = await sav3Ipfs.getPeersCids()
      setPeersCids(peerCids)
    })()
  }, [pollCount])

  return peerCids
}

export default usePeersCids
