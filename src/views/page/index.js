import {Switch, Route} from 'react-router-dom'

// pages
import WhatIsSav3 from './pages/what-is-sav3'
import HowDoesSav3Work from './pages/how-does-sav3-work'
import License from './pages/license'

function Page () {
  return (
    <div>
      <Switch>
        <Route path='/page/what-is-sav3' exact>
          <WhatIsSav3 />
        </Route>
        <Route path='/page/how-does-sav3-work' exact>
          <HowDoesSav3Work />
        </Route>
        <Route path='/page/license' exact>
          <License />
        </Route>
      </Switch>
    </div>
  )
}

export default Page
