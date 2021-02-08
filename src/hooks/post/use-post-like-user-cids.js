import {useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useInterval from 'src/hooks/utils/use-interval'

const usePostLikeUserCids = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [likeUserCids, setLikeUserCids] = useState([])

  useInterval(() => {
    if (!postCid) {
      // don't trigger rerender if already empty
      if (likeUserCids.length !== 0) {
        setLikeUserCids([])
      }
      return
    }
    ;(async () => {
      const res = await sav3Ipfs.getPostLikeUserCids(postCid)
      // don't trigger rerender if is same array
      if (JSON.stringify(res) === JSON.stringify(likeUserCids)) {
        return
      }
      setLikeUserCids(res)
    })()
  }, 1000)

  return likeUserCids
}

export default usePostLikeUserCids
