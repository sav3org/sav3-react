import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'

const useOwnUserCid = () => {
  const [ownUserCid, setOwnUserCid] = useState()

  useEffect(() => {
    ;(async () => {
      const ownUserCid = await sav3Ipfs.getOwnUserCid()
      setOwnUserCid(ownUserCid)
    })()
  }, [])

  return ownUserCid
}

export default useOwnUserCid
