import { combineReducers } from 'redux'

// reducers

import skinReducer from './skin'

const createReducer = () =>
  combineReducers({
    skinState: skinReducer,
  })

export default createReducer
