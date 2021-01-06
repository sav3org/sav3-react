import {useEffect, useState} from 'react'
import bootstrapUsersUtils from 'src/lib/sav3-ipfs/utils/bootstrap-users'

const useBootstrapUsersCids = () => {
  const [bootstrapUsersCids, setBootstrapUsersCids] = useState([])
  console.log('useBootstrapUsersCids', {bootstrapUsersCids})

  useEffect(() => {
    ;(async () => {
      const bootstrapUsersCids = await bootstrapUsersUtils.getBootstrapUsersCids()
      setBootstrapUsersCids(bootstrapUsersCids)
    })()
  }, [])

  return bootstrapUsersCids
}

export default useBootstrapUsersCids
