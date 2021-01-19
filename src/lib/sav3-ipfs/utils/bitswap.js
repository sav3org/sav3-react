import QuickLRU from 'quick-lru'
import Debug from 'debug'
export const blockReceivedPeerCidCache = new QuickLRU({maxSize: 1000})
const debug = Debug('sav3:sav3-ipfs:utils:bitswap')

/**
 * cache the peer cids of senders of blocks/files received
 *
 * @param {IPFS} ipfs
 * @returns {IPFS}
 */
export const withBlockReceivedPeerCidCache = (ipfs) => {
  let bitswapUpdateReceiveCounters = ipfs.ipld.bs._bitswap._updateReceiveCounters
  bitswapUpdateReceiveCounters = bitswapUpdateReceiveCounters.bind(ipfs.ipld.bs._bitswap)
  ipfs.ipld.bs._bitswap._updateReceiveCounters = bitswapUpdateReceiveCountersWithBlockReceivedPeerCidCache(bitswapUpdateReceiveCounters)

  return ipfs
}

/**
 * wrap Bitswap._updateReceiveCounters function to cache the peer cid of the sender of every block
 *
 * @param {Function} bitswapUpdateReceiveCounters - get it from ipfs.ipld.bs._bitswap._updateReceiveCounters
 * @returns {Function} a wrapped Bitswap._updateReceiveCounters function
 */
const bitswapUpdateReceiveCountersWithBlockReceivedPeerCidCache = (bitswapUpdateReceiveCounters) => (peerId, block, exists) => {
  // first time we see this block/file
  if (exists === false) {
    const peerCid = peerId
    const blockCid = block.cid.toString()
    blockReceivedPeerCidCache.set(peerCid, blockCid)
    debug('bitswapUpdateReceiveCounters', {peerCid, blockCid})
  }
  return bitswapUpdateReceiveCounters(peerId, block, exists)
}

export default {
  withBlockReceivedPeerCidCache,
  blockReceivedPeerCidCache
}
