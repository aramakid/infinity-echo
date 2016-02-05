import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import authReducer from './authReducer'
import messageReducer from './messageReducer'

const reducers = combineReducers({
  routing: routeReducer,
  auth: authReducer,
  message: messageReducer
});

export default reducers;
