import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import store from './store/Store'
import Root from './containers/Root'

ReactDOM.render(
    <Root store={store} history={browserHistory}/>,
  document.getElementById('root')
)
