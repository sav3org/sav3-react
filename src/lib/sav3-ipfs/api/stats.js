import webRtcUtils from '../utils/webrtc'
import PeerId from 'peer-id'
import assert from 'assert'
import Debug from 'debug'
const debug = Debug('sav3:sav3-ipfs:api:stats')

/**
 * get information and stats about all connected peers
 *
 * @returns {Promise<{peerCid: string, ip: string | undefined, port: number | undefined, protocol: string | undefined, dataReceived: number, dataSent: number}>}
 */
async function getPeersStats () {
  await this.waitForReady()

  const peersStats = []
  const peerCids = await this.getPeersCids()
  for (const peerCid of peerCids) {
    peersStats.push(await this.getPeerStats(peerCid))
  }
  debug('getPeersStats', {peersStats})
  return peersStats
}

async function getPeerStats (peerCid) {
  await this.waitForReady()
  assert(typeof peerCid === 'string', `sav3Ipfs.getPeerStats peerId '${peerCid}' not a string`)

  const metrics = this.ipfs.libp2p.metrics

  let ip, port, protocol
  try {
    const connectionInfo = await webRtcUtils.getWebRtcPeerConnectionInfo(peerCid)
    ip = connectionInfo.ip
    port = connectionInfo.port
    protocol = connectionInfo.protocol
  }
  catch (e) {}

  const peerMetrics = metrics.forPeer(PeerId.createFromCID(peerCid)).toJSON()
  const dataReceived = Number(peerMetrics.dataReceived)
  const dataSent = Number(peerMetrics.dataSent)

  const peerStats = {peerCid, ip, port, protocol, dataReceived, dataSent}
  return peerStats
}

export default {
  getPeersStats,
  getPeerStats
}
