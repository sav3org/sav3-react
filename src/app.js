import './app.css'
import {Switch, Route, Link} from 'react-router-dom'
import PeersIps from 'src/views/demo/peers-ips'

/**
 * @returns {JSX.Element}
 */
function App () {
  return (
    <div className='App'>
      <Switch>
        <Route path='/demo/peers-ips'>
          <PeersIps />
        </Route>
      </Switch>
      <div>
        <h1>Demos</h1>
        <ul>
          <li>
            <Link to='/demo/peers-ips'>Peers IPs</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default App
