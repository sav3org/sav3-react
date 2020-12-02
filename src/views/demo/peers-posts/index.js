import logo from 'src/assets/images/logo.png'
import './index.css'
import usePeersStats from 'src/hooks/use-peers-stats'
import usePeersPosts from 'src/hooks/use-peers-posts'
import prettyBytes from 'pretty-bytes'

/**
 * @returns {JSX.Element}
 */
function PeersIps () {
  const peersStats = usePeersStats()
  const peersCids = []
  for (const peerStats of peersStats) {
    peersCids.push(peerStats.peerCid)
  }
  const peersPosts = usePeersPosts(peersCids)
  console.log({peersStats, peersPosts})

  const peersStatsElements = []
  for (const peerStats of peersStats) {
    if (!peerStats.ip) {
      continue
    }
    peersStatsElements.push(
      <div className='peer' key={peerStats.peerCid}>
        <p>
          {peerStats.ip}:{peerStats.port} {peerStats.countryFlagEmoji}
        </p>
        <p className='peer-data'>
          ⬆️{prettyBytes(peerStats.dataSent)} ⬇️
          {prettyBytes(peerStats.dataReceived)}
        </p>
      </div>
    )
  }

  if (!peersStatsElements.length) {
    peersStatsElements.push(<p>Looking for peers...</p>)
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <div>{peersStatsElements}</div>
        {/*
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        */}
      </header>
    </div>
  )
}

export default PeersIps
