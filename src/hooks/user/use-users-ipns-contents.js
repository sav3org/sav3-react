import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import usePrevious from 'src/hooks/utils/use-previous'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-users-ipns-contents')

const useUsersIpnsContents = (ipnsPaths) => {
  assert(Array.isArray(ipnsPaths), `invalid ipnsPaths '${JSON.stringify(ipnsPaths)}'`)
  for (const ipnsPath of ipnsPaths) {
    assert(ipnsPath && typeof ipnsPath === 'string', `invalid ipnsPaths '${JSON.stringify(ipnsPaths)}' contains non string`)
  }

  const [usersIpnsContents, setUsersIpnsContents] = useState(getDefaultUsersIpnsContents(ipnsPaths))
  const uniqueIpnsPaths = new Set(ipnsPaths)
  const previousUniqueIpnsPaths = usePrevious(uniqueIpnsPaths)

  // if remount, only subscribe to not yet subscribed
  const unsubscribedIpnsPaths = []
  for (const ipnsPath of uniqueIpnsPaths) {
    if (!previousUniqueIpnsPaths || !previousUniqueIpnsPaths.has(ipnsPath)) {
      unsubscribedIpnsPaths.push(ipnsPath)
    }
  }

  debug({ipnsPaths, usersIpnsContents, unsubscribedIpnsPaths})

  // if remount, delete removed ipns paths, and set new empty ipns paths contents
  const updateIpnsContents = () => {
    const newEmptyIpnsContents = []
    const removedIpnsContents = []

    // find new empty ipns paths contents
    for (const ipnsPath of ipnsPaths) {
      if (!usersIpnsContents[ipnsPath]) {
        newEmptyIpnsContents.push(ipnsPath)
      }
    }

    // find removed ipns paths
    for (const ipnsPath in usersIpnsContents) {
      if (!uniqueIpnsPaths.has(ipnsPath)) {
        removedIpnsContents.push(ipnsPath)
      }
    }

    // if found any updates, set them
    if (newEmptyIpnsContents.length || removedIpnsContents.length) {
      setUsersIpnsContents((previousUsersIpnsContents) => {
        const newUsersIpnsContents = {...previousUsersIpnsContents}
        for (const missingDefaultIpnsContent of newEmptyIpnsContents) {
          if (!newUsersIpnsContents[missingDefaultIpnsContent]) {
            newUsersIpnsContents[missingDefaultIpnsContent] = {}
          }
        }
        for (const removedIpnsContent of removedIpnsContents) {
          delete newUsersIpnsContents[removedIpnsContent]
        }
        return newUsersIpnsContents
      })
    }
  }

  useEffect(() => {
    updateIpnsContents()

    if (!unsubscribedIpnsPaths.length) {
      return
    }

    // subscribe to future published ipns paths
    const onPublish = async (newIpnsPath, ipnsValue) => {
      if (!uniqueIpnsPaths.has(newIpnsPath)) {
        // publish event is a different user
        return
      }

      // update usersIpnsContents state asynchronously as new ipfs files arrive
      const ipnsContent = await sav3Ipfs.getUserIpnsContent(ipnsValue)
      setUsersIpnsContents((previousUsersIpnsContents) => ({
        ...previousUsersIpnsContents,
        [newIpnsPath]: ipnsContent
      }))
    }
    sav3Ipfs.on('publish', onPublish)

    // get the current ipns paths once
    ;(async () => {
      const ipnsValues = await sav3Ipfs.subscribeToIpnsPaths(unsubscribedIpnsPaths)
      for (const [i, ipnsValue] of ipnsValues.entries()) {
        if (!ipnsValue) {
          // user has not published anything yet
          continue
        }

        // update usersIpnsContent state asynchronously as new ipfs files arrive
        const ipnsPath = unsubscribedIpnsPaths[i]
        sav3Ipfs.getUserIpnsContent(ipnsValue).then((ipnsContent) => {
          setUsersIpnsContents((previousUsersIpnsContents) => ({
            ...previousUsersIpnsContents,
            [ipnsPath]: ipnsContent
          }))
        })
      }
    })()

    // unsubscribe after component unmounts
    return () => {
      sav3Ipfs.off('publish', onPublish)
    }
  }, [JSON.stringify(ipnsPaths)])

  return usersIpnsContents
}

const getDefaultUsersIpnsContents = (ipnsPaths) => {
  const defaultUsersIpnsContents = {}
  for (const ipnsPath of ipnsPaths) {
    defaultUsersIpnsContents[ipnsPath] = {}
  }
  return defaultUsersIpnsContents
}

export default useUsersIpnsContents
