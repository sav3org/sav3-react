import {useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useInterval from 'src/hooks/utils/use-interval'

const usePostRepliesCids = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [repliesCids, setRepliesCids] = useState([])

  useInterval(() => {
    if (!postCid) {
      setRepliesCids([])
      return
    }
    ;(async () => {
      const repliesCids = await sav3Ipfs.getPostRepliesCids(postCid)
      setRepliesCids(repliesCids)
    })()
  }, 1000)

  return repliesCids
}

export default usePostRepliesCids
