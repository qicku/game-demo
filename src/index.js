import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'

import { isDebugMode } from '~Lib/env/safe-dot-env'
import { AppBase } from './lib/env'

import './main.scss'
import './locales'

import App from './boot/App'

import configurationStore, { initialState } from './store'

StartupUI()
//.catch((err) => console.log(err))

function StartupUI() {
  const container = document.getElementById('root')

  let preloadedState = { ...initialState }

  const store = configurationStore(preloadedState)

  ReactDOM.render(
    <StrictMode>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </StrictMode>,
    container
  )

  global.AppBase = AppBase

  if (isDebugMode) {
    global.store = store
  }
}
