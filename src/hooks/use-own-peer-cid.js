import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'

const useOwnPeerCid = () => {
  const [ownPeerCid, setOwnPeerCid] = useState()

  useEffect(() => {
    ;(async () => {
      const ownPeerCid = await sav3Ipfs.getOwnPeerCid()
      setOwnPeerCid(ownPeerCid)
    })()
  }, [])

  return ownPeerCid
}

export default useOwnPeerCid
