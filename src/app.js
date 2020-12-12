import {Switch, Route, Link} from 'react-router-dom'
import PeersIps from 'src/views/demo/peers-ips'
import PeersPosts from 'src/views/demo/peers-posts'
import Profile from 'src/views/profile'
import {ThemeContext} from 'src/themes/theme-provider'
import {useContext} from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import themes from 'src/themes'

/**
 * @returns {JSX.Element}
 */
function App () {
  const {currentTheme, setTheme} = useContext(ThemeContext)
  const handleThemeChange = (event) => {
    setTheme(event.target.value)
  }
  const themeMenuItems = []
  for (const themeName in themes) {
    themeMenuItems.push(
      <MenuItem key={themeName} value={themeName}>
        {themeName}
      </MenuItem>
    )
  }

  return (
    <div className='App'>
      <Select value={currentTheme} onChange={handleThemeChange} label='Theme' variant='outlined'>
        {themeMenuItems}
      </Select>

      <Switch>
        <Route path='/demo/peers-ips'>
          <PeersIps />
        </Route>
        <Route path='/demo/peers-posts'>
          <PeersPosts />
        </Route>
        <Route path='/'>
          <Profile />
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
