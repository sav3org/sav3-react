import {useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useInterval from 'src/hooks/utils/use-interval'

const usePostRepliesCids = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [repliesCids, setRepliesCids] = useState([])

  useInterval(() => {
    if (!postCid) {
      // don't trigger rerender if already empty
      if (repliesCids.length !== 0) {
        setRepliesCids([])
      }
      return
    }
    ;(async () => {
      const res = await sav3Ipfs.getPostRepliesCids(postCid)
      // don't trigger rerender if is same array
      if (JSON.stringify(res) === JSON.stringify(repliesCids)) {
        return
      }
      setRepliesCids(res)
    })()
  }, 1000)

  return repliesCids
}

export default usePostRepliesCids
