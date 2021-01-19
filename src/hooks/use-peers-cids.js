import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'

// TODO: convert to useInterval

const usePeersCids = () => {
  const [peerCids, setPeersCids] = useState([])
  const [pollCount, setPollCount] = useState(0)

  const pollTime = 2000 // if too fast will break the peer posts demo
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
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
