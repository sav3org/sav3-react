import {useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useInterval from 'src/hooks/utils/use-interval'

const usePostQuoteCids = (postCid) => {
  assert(!postCid || typeof postCid === 'string', `invalid postCid '${JSON.stringify(postCid)}'`)
  const [quoteCids, setQuoteCids] = useState([])

  useInterval(() => {
    if (!postCid) {
      // don't trigger rerender if already empty
      if (quoteCids.length !== 0) {
        setQuoteCids([])
      }
      return
    }
    ;(async () => {
      const res = await sav3Ipfs.getPostQuoteCids(postCid)
      // don't trigger rerender if is same array
      if (JSON.stringify(res) === JSON.stringify(quoteCids)) {
        return
      }
      setQuoteCids(res)
    })()
  }, 1000)

  return quoteCids
}

export default usePostQuoteCids
