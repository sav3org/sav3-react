import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'

const useUserIpnsData = (ipnsPath) => {
  assert(!ipnsPath || typeof ipnsPath === 'string', `invalid ipnsPath '${JSON.stringify(ipnsPath)}'`)
  const [userIpnsData, setUserIpnsData] = useState()
  console.log('useUserIpnsData', {ipnsPath, userIpnsData})

  useEffect(() => {
    if (!ipnsPath) {
      return
    }

    // subscribe to future published ipns paths
    const onPublish = async (newIpnsPath, ipnsValue) => {
      if (ipnsPath !== newIpnsPath) {
        // publish event is a different user
        return
      }
      const ipnsData = await sav3Ipfs.getIpfsFile(ipnsValue)
      setUserIpnsData(JSON.parse(ipnsData))
    }
    sav3Ipfs.on('publish', onPublish)

    // get the current ipns path
    ;(async () => {
      const ipnsValue = await sav3Ipfs.subscribeToIpnsPath(ipnsPath)
      if (!ipnsValue) {
        // user has not published anything yet
        setUserIpnsData()
        return
      }
      const ipnsData = await sav3Ipfs.getIpfsFile(ipnsValue)
      setUserIpnsData(JSON.parse(ipnsData))
    })()

    // unsubscribe after component unmounts
    return () => {
      sav3Ipfs.off('publish', onPublish)
    }
  }, [ipnsPath])

  return userIpnsData
}

export default useUserIpnsData
