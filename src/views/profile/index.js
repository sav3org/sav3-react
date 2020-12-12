import React from 'react'
import logo from 'src/assets/images/logo.png'
import usePeersStats from 'src/hooks/use-peers-stats'
import useUserPosts from 'src/hooks/use-user-posts'
import useOwnPeerCid from 'src/hooks/use-own-peer-cid'
import prettyBytes from 'pretty-bytes'
import sav3Ipfs from 'src/lib/sav3-ipfs'

/**
 * @returns {JSX.Element}
 */
function PeersPosts () {
  const peersStats = usePeersStats()

  const peersStatsElements = []
  for (const peerStats of peersStats) {
    if (!peerStats.ip) {
      continue
    }
    peersStatsElements.push(<PeerPosts peerStats={peerStats} key={peerStats.peerCid + peerStats.ip + peerStats.port} />)
  }

  if (!peersStatsElements.length) {
    peersStatsElements.push(<p key='looking for peers'>Looking for peers...</p>)
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <SendForm />
        <OwnPeerPosts />
        <div>{peersStatsElements}</div>
      </header>
    </div>
  )
}

class SendForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {value: ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    if (event.target.value.length > 140) {
      return
    }
    this.setState({value: event.target.value})
  }

  handleSubmit (event) {
    sav3Ipfs.publishPost({content: this.state.value})
    this.setState({value: ''})
    event.preventDefault()
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input type='text' value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type='submit' value='Send' />
      </form>
    )
  }
}

/**
 * @param props
 * @param props.peerStats
 * @returns {JSX.Element}
 */
function PeerPosts ({peerStats}) {
  const peerPosts = useUserPosts(peerStats.peerCid)
  console.log('PeerPosts', {peerCid: peerStats.peerCid, peerPosts})

  const peerMessage = peerPosts[0] && peerPosts[0].content

  return (
    <div className='peer'>
      <div>
        <span>
          {peerStats.ip}:{peerStats.port} {peerStats.countryFlagEmoji}
        </span>{' '}
        <div className='peer-data'>
          <p>⬆️ {prettyBytes(peerStats.dataSent)}</p>
          <p>⬇️ {prettyBytes(peerStats.dataReceived)}</p>
        </div>
      </div>
      {peerMessage && <p className='peer-message'>💬 {peerMessage}</p>}
    </div>
  )
}

/**
 * @returns {JSX.Element}
 */
function OwnPeerPosts () {
  const ownPeerCid = useOwnPeerCid()
  const peerPosts = useUserPosts(ownPeerCid)
  const peerMessage = peerPosts[0] && peerPosts[0].content

  if (!peerMessage) {
    return <div></div>
  }

  return (
    <div className='peer'>
      <div>You</div>
      {peerMessage && <p className='peer-message'>💬 {peerMessage}</p>}
    </div>
  )
}

export default PeersPosts
