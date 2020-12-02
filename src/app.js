import './app.css'
import {Switch, Route, Link} from 'react-router-dom'
import PeersIps from 'src/views/demo/peers-ips'
import PeersPosts from 'src/views/demo/peers-posts'

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
        <Route path='/demo/peers-posts'>
          <PeersPosts />
        </Route>
      </Switch>
      <div>
        <h1>Demos</h1>
        <ul>
          <li>
            <Link to='/demo/peers-ips'>Peers IPs</Link>
          </li>
          <li>
            <Link to='/demo/peers-posts'>Peers Posts</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default App
