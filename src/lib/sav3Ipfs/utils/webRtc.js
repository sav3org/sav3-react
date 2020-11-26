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
import QuickLRU from 'quick-lru'
import assert from 'assert'
const sdpCache = new QuickLRU({maxSize: 1000})


/**
 * cache webrtc sdp of each peer to get their ip addresses later
 * @param {IPFS} ipfs
 * @returns {IPFS}
 */
export const withWebRtcSdpCache = (ipfs) => {
  console.log('withWebRtcSdpCache', ipfs)
  let webRtcStarConnect = ipfs.libp2p.transportManager._transports.get('WebRTCStar')._connect
  webRtcStarConnect = webRtcStarConnect.bind(ipfs.libp2p.transportManager._transports.get('WebRTCStar'))
  ipfs.libp2p.transportManager._transports.get('WebRTCStar')._connect = webRtcStarConnectWithSdpCache(webRtcStarConnect)
  return ipfs
}

/**
 * wrap WebRTCStar._connect function to cache each peer sdp
 * @param {function} webRtcStarConnect - get it from ipfs.libp2p.transportManager._transports.get('WebRTCStar')._connect
 * @returns {SimplePeer} a simple peer instance from the npm module 'simple-peer'
 */
const webRtcStarConnectWithSdpCache = (webRtcStarConnect) => async (multiaddress, options) => {
  const simplePeer = await webRtcStarConnect(multiaddress, options)
  // TODO: check if simplePeer._pc.localDescription.sdp is more accurate
  sdpCache.set(multiaddress.getPeerId(), simplePeer._pc.remoteDescription.sdp)
  // console.log('new simple peer', multiaddress.getPeerId(), simplePeer._pc.remoteDescription.sdp)
  return simplePeer
}

/**
 * get ip, port and protocol of a webrtc peer
 * @param {String} peerId
 * @returns {{ip: String, port: Number, protocol: String}}
 */
export const getWebRtcPeerConnectionInfo = (peerId) => {
  assert(peerId && typeof peerId === 'string', `invalid peer id ${peerId}`)
  const sdpString = sdpCache.get(peerId)
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
