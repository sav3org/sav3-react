import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3Ipfs'
import ipUtils from 'src/lib/utils/ip'

const usePeersStats = () => {
  const [peersStats, setPeersStats] = useState([])

  useEffect(() => {
    const interval = setInterval(async () => {
      const peersStats = await sav3Ipfs.getPeersStats()
      for (const peersStat of peersStats) {
        if (!peersStat.ip) {
          continue
        }
        let isoCountryCode
        try {
          isoCountryCode = await ipUtils.getIsoCountryCodeFromIpCached(peersStat.ip)
        }
        catch (e) {
          console.log(e)
          continue
        }
        const countryFlagEmoji = ipUtils.isoCountryCodeToCountryFlagEmoji(isoCountryCode)

        peersStat.isoCountryCode = isoCountryCode
        peersStat.countryFlagEmoji = countryFlagEmoji
      }
      setPeersStats(peersStats)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return peersStats
}

export default usePeersStats
