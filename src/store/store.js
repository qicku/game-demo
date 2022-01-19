/****************************
 * FilePath: store.js
 * 2022-01-19 20:34:30
 * Description:
 * 		 Generate By Quick DevTools
 * Copyright 2018-2022 QuickDev GRP, All Rights Reserved.
 *
 */
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { storeLogged } from '~/lib/env'

import createReducer from './reducers'

const loggerMiddleware = createLogger({ collapsed: true })
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configurationStore(preloadedState) {
  const middlewears = storeLogged
    ? [thunkMiddleware, loggerMiddleware]
    : [thunkMiddleware]

  const middlewearEnhancer = applyMiddleware(...middlewears)

  const enhancers = [middlewearEnhancer]

  const store = createStore(
    createReducer(),
    preloadedState,
    composeEnhancers(...enhancers)
  )

  return store
}
