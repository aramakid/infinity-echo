import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import { syncHistory} from 'redux-simple-router'
import reducers from '../reducers'

const reduxRouteMiddleware = syncHistory(browserHistory)

const initialState = {
  auth: {
    isLogin: false,
    user: {}
  },
  message: {
    isListen: false,
    isPosting: false,
    timeline: [],
    likes: [],
    posts: [],
    tags: {}
  }
}

const store = compose(
  applyMiddleware(
    thunk,
    reduxRouteMiddleware
  )
)(createStore)(reducers, initialState)

reduxRouteMiddleware.listenForReplays(store)

export default store;
