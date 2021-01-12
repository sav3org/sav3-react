import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'

const useUsersIpnsContent = (ipnsPaths) => {
  assert(Array.isArray(ipnsPaths), `invalid ipnsPaths '${JSON.stringify(ipnsPaths)}'`)
  const defaultUsersIpnsContent = {}
  const [usersIpnsContent, setUsersIpnsContent] = useState(defaultUsersIpnsContent)
  console.log('useUsersIpnsContent', {ipnsPaths, usersIpnsContent})

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

      // update usersIpnsContent state asynchronously as new ipfs files arrive
      const ipnsContent = await sav3Ipfs.getIpfsContent(ipnsValue)
      setUsersIpnsContent((previousUsersIpnsContent) => ({
        ...previousUsersIpnsContent,
        [newIpnsPath]: JSON.parse(ipnsContent)
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

        // update usersIpnsContent state asynchronously as new ipfs files arrive
        const ipnsPath = ipnsPaths[i]
        sav3Ipfs.getIpfsContent(ipnsValue).then((ipnsContent) => {
          setUsersIpnsContent((previousUsersIpnsContent) => ({
            ...previousUsersIpnsContent,
            [ipnsPath]: JSON.parse(ipnsContent)
          }))
        })
      }
    })()

    // unsubscribe after component unmounts
    return () => {
      sav3Ipfs.off('publish', onPublish)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ipnsPaths)])

  return usersIpnsContent
}

export default useUsersIpnsContent
