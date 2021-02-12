import {useEffect, useState} from 'react'
import bootstrapUsersUtils from 'src/lib/sav3-ipfs/utils/bootstrap-users'
import Debug from 'debug'
const debug = Debug('sav3:hooks:following:use-bootstrap-blacklisted-users-cids')

const useBootstrapBlacklistedUsersCids = () => {
  const [bootstrapBlacklistedUsersCids, setBootstrapBlacklistedUsersCids] = useState([])
  debug({bootstrapBlacklistedUsersCids})

  useEffect(() => {
    ;(async () => {
      const bootstrapBlacklistedUsersCids = await bootstrapUsersUtils.getBootstrapBlacklistedUsersCids()
      setBootstrapBlacklistedUsersCids(bootstrapBlacklistedUsersCids)
    })()
  }, [])

  return bootstrapBlacklistedUsersCids
}

export default useBootstrapBlacklistedUsersCids
