/*
how to find connection info from sdp

the ip address, port and protocol are found in c= and m=, e.g.:

o=- 5426292242984389744 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE 0
a=msid-semantic: WMS
m=application 64656 UDP/DTLS/SCTP webrtc-datachannel
c=IN IP4 31.220.1.161
b=AS:30
a=candidate:970568614 1 udp 2113937151 f6bd80ff-8fef-4b18-b97e-5d6317873c95.local 64656 typ host generation 0 network-cost 999
a=candidate:842163049 1 udp 1677729535 31.220.1.161 64656 typ srflx raddr 0.0.0.0 rport 0 generation 0 network-cost 999
a=ice-ufrag:9nHb
a=ice-pwd:BBIh/kIoQ58WUUj9GxikRqZN
...
*/

import * as sdpTransform from 'sdp-transform'
import assert from 'assert'

import IdbLru from 'src/lib/utils/idb-lru'

import Debug from 'debug'
export const sdpCache = IdbLru({
  name: 'sdpCache',
  maxSize: 2000
})
const debug = Debug('sav3:sav3-ipfs:utils:webrtc')

/**
 * cache webrtc sdp of each peer to get their ip addresses later
 *
 * @param {IPFS} ipfs
 * @returns {IPFS}
 */
export const withWebRtcSdpCache = (ipfs) => {
  // outbound webrtc connections
  let webRtcStarConnect = ipfs.libp2p.transportManager._transports.get('WebRTCStar')._connect
  webRtcStarConnect = webRtcStarConnect.bind(ipfs.libp2p.transportManager._transports.get('WebRTCStar'))
  ipfs.libp2p.transportManager._transports.get('WebRTCStar')._connect = webRtcStarConnectWithSdpCache(webRtcStarConnect)

  // inbound webrtc connections
  let webRtcStarUpgradeInbound = ipfs.libp2p.transportManager._transports.get('WebRTCStar')._upgrader.upgradeInbound
  webRtcStarUpgradeInbound = webRtcStarUpgradeInbound.bind(ipfs.libp2p.transportManager._transports.get('WebRTCStar')._upgrader)
  ipfs.libp2p.transportManager._transports.get('WebRTCStar')._upgrader.upgradeInbound = webRtcStarUpgradeInboundWithSdpCache(webRtcStarUpgradeInbound)

  return ipfs
}

/**
 * wrap WebRTCStar._connect function to cache each peer sdp
 *
 * @param {Function} webRtcStarConnect - get it from ipfs.libp2p.transportManager._transports.get('WebRTCStar')._connect
 * @returns {Function} a wrapped WebRTCStar._connect function
 */
const webRtcStarConnectWithSdpCache = (webRtcStarConnect) => async (multiaddress, options) => {
  const simplePeer = await webRtcStarConnect(multiaddress, options)
  const cid = multiaddress.getPeerId()
  sdpCache.set(cid, simplePeer._pc.remoteDescription.sdp)
  debug('outbound webrtc connection', cid, simplePeer._pc.remoteDescription.sdp)
  return simplePeer
}

/**
 * wrap WebRTCStar._upgrader.upgradeInbound function to cache each peer sdp
 *
 * @param {Function} webRtcStarUpgradeInbound - get it from ipfs.libp2p.transportManager._transports.get('WebRTCStar')._upgrader.upgradeInbound
 * @returns {Function} a wrapped WebRTCStar._upgrader.upgradeInbound function
 */
const webRtcStarUpgradeInboundWithSdpCache = (webRtcStarUpgradeInbound) => async (maConn) => {
  const connection = await webRtcStarUpgradeInbound(maConn)
  const cid = connection.remotePeer.toB58String()
  sdpCache.set(cid, maConn.conn._pc.remoteDescription.sdp)
  debug('inbound webrtc connection', cid, maConn.conn._pc.remoteDescription.sdp)
  return connection
}

/**
 * get ip, port and protocol of a webrtc peer
 *
 * @param {string} peerId
 * @returns {{ip: string, port: number, protocol: string}}
 */
export const getWebRtcPeerConnectionInfo = async (peerId) => {
  assert(peerId && typeof peerId === 'string', `invalid peer id ${peerId}`)
  const sdpString = await sdpCache.get(peerId)
  assert(sdpString, `no sdp cache for peer id '${peerId}'`)

  const sdp = sdpTransform.parse(sdpString)
  const webRtcPeerConnectionInfo = {
    ip: sdp.media[0].connection.ip,
    port: sdp.media[0].port,
    protocol: sdp.media[0].protocol
  }
  return webRtcPeerConnectionInfo
}

export default {
  withWebRtcSdpCache,
  sdpCache,
  getWebRtcPeerConnectionInfo
}
