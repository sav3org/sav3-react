import {useEffect, useState} from 'react'
import bootstrapUsersUtils from 'src/lib/sav3-ipfs/utils/bootstrap-users'
import Debug from 'debug'
const debug = Debug('sav3:hooks:following:use-bootstrap-users-cids')

const useBootstrapUsersCids = () => {
  const [bootstrapUsersCids, setBootstrapUsersCids] = useState([])
  debug({bootstrapUsersCids})

  useEffect(() => {
    ;(async () => {
      const bootstrapUsersCids = await bootstrapUsersUtils.getBootstrapUsersCids()
      setBootstrapUsersCids(bootstrapUsersCids)
    })()
  }, [])

  return bootstrapUsersCids
}

export default useBootstrapUsersCids
