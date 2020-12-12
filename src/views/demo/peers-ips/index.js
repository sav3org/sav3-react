import logo from 'src/assets/images/logo.png'
import usePeersStats from 'src/hooks/use-peers-stats'
import prettyBytes from 'pretty-bytes'

/**
 * @returns {JSX.Element}
 */
function PeersIps () {
  const peersStats = usePeersStats()
  console.log(peersStats)

  const peersStatsElements = []
  for (const peerStats of peersStats) {
    if (!peerStats.ip) {
      continue
    }
    peersStatsElements.push(
      <div className='peer' key={peerStats.peerCid + peerStats.ip + peerStats.port}>
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
    peersStatsElements.push(<p key='looking for peers'>Looking for peers...</p>)
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
