import {useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useInterval from 'src/hooks/utils/use-interval'

const usePostReplyCids = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [replyCids, setReplyCids] = useState([])

  useInterval(() => {
    if (!postCid) {
      // don't trigger rerender if already empty
      if (replyCids.length !== 0) {
        setReplyCids([])
      }
      return
    }
    ;(async () => {
      const res = await sav3Ipfs.getPostReplyCids(postCid)
      // don't trigger rerender if is same array
      if (JSON.stringify(res) === JSON.stringify(replyCids)) {
        return
      }
      setReplyCids(res)
    })()
  }, 1000)

  return replyCids
}

export default usePostReplyCids
