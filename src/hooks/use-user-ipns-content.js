import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-user-ipns-content')

const useUserIpnsContent = (ipnsPath) => {
  assert(!ipnsPath || typeof ipnsPath === 'string', `invalid ipnsPath '${JSON.stringify(ipnsPath)}'`)
  const [userIpnsContent, setUserIpnsContent] = useState()
  debug({ipnsPath, userIpnsContent})

  useEffect(() => {
    // reset content on ipns path change
    if (userIpnsContent) {
      setUserIpnsContent()
    }
    if (!ipnsPath) {
      return
    }

    // subscribe to future published ipns paths
    const onPublish = async (newIpnsPath, ipnsValue) => {
      if (ipnsPath !== newIpnsPath) {
        // publish event is a different user
        return
      }
      const ipnsContent = await sav3Ipfs.getIpfsContent(ipnsValue)
      setUserIpnsContent(JSON.parse(ipnsContent))
    }
    sav3Ipfs.on('publish', onPublish)

    // get the current ipns path
    ;(async () => {
      const ipnsValue = await sav3Ipfs.subscribeToIpnsPath(ipnsPath)
      if (!ipnsValue) {
        // user has not published anything yet
        setUserIpnsContent()
        return
      }
      const ipnsContent = await sav3Ipfs.getIpfsContent(ipnsValue)
      setUserIpnsContent(JSON.parse(ipnsContent))
    })()

    // unsubscribe after component unmounts
    return () => {
      sav3Ipfs.off('publish', onPublish)
    }
  }, [ipnsPath])

  return userIpnsContent
}

export default useUserIpnsContent
