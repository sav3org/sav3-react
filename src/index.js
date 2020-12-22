import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import reportWebVitals from './report-web-vitals'
import {HashRouter} from 'react-router-dom'
import FollowingProvider from 'src/hooks/following/following-provider'
import LanguageCodeProvider from 'src/translations/language-code-provider'
import ThemeProvider from 'src/themes/theme-provider'
import CssBaseline from '@material-ui/core/CssBaseline'

ReactDOM.render(
  <HashRouter>
    <ThemeProvider>
      <LanguageCodeProvider>
        <FollowingProvider>
          <CssBaseline />
          <App />
        </FollowingProvider>
      </LanguageCodeProvider>
    </ThemeProvider>
  </HashRouter>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
