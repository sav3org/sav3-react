import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import ipUtils from 'src/lib/utils/ip'

const usePeersStats = () => {
  const [peersStats, setPeersStats] = useState([])
  const [pollCount, setPollCount] = useState(0)

  const pollTime = 10000
  useEffect(() => {
    const interval = setInterval(() => {
      setPollCount(pollCount + 1)
    }, pollTime)
  }, [])

  useEffect(async () => {
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
  }, [pollCount])

  return peersStats
}

export default usePeersStats
