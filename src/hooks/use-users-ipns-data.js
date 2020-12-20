import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'

const useUsersIpnsData = (ipnsPaths) => {
  assert(Array.isArray(ipnsPaths), `invalid ipnsPaths '${JSON.stringify(ipnsPaths)}'`)
  const defaultUsersIpnsData = {}
  const [usersIpnsData, setUsersIpnsData] = useState(defaultUsersIpnsData)
  console.log('useUsersIpnsData', {ipnsPaths, usersIpnsData})

  useEffect(() => {
    if (!ipnsPaths.length) {
      return
    }

    const ipnsPathsSet = new Set(ipnsPaths)

    // subscribe to future published ipns paths
    const onPublish = async (newIpnsPath, ipnsValue) => {
      if (!ipnsPathsSet.has(newIpnsPath)) {
        // publish event is a different user
        return
      }

      // update usersIpnsData state asynchronously as new ipfs files arrive
      const ipnsData = await sav3Ipfs.getIpfsFile(ipnsValue)
      setUsersIpnsData((previousUsersIpnsData) => ({
        ...previousUsersIpnsData,
        [newIpnsPath]: JSON.parse(ipnsData)
      }))
    }
    sav3Ipfs.on('publish', onPublish)

    // get the current ipns paths once
    ;(async () => {
      const ipnsValues = await sav3Ipfs.subscribeToIpnsPaths(ipnsPaths)
      for (const [i, ipnsValue] of ipnsValues.entries()) {
        if (!ipnsValue) {
          // user has not published anything yet
          continue
        }

        // update usersIpnsData state asynchronously as new ipfs files arrive
        const ipnsPath = ipnsPaths[i]
        sav3Ipfs.getIpfsFile(ipnsValue).then((ipnsData) => {
          setUsersIpnsData((previousUsersIpnsData) => ({
            ...previousUsersIpnsData,
            [ipnsPath]: JSON.parse(ipnsData)
          }))
        })
      }
    })()

    // unsubscribe after component unmounts
    return () => {
      sav3Ipfs.off('publish', onPublish)
    }
  }, [JSON.stringify(ipnsPaths)])

  return usersIpnsData
}

export default useUsersIpnsData
