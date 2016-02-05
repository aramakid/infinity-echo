import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'
import App from '../containers/App'
import Home from '../containers/Home'
import Profile from '../containers/Profile'
import Tag from '../containers/Tag'

export default class Root extends React.Component {
  render(){
    const {store, history} = this.props
    return (
      <div id="contents">
        <Provider store={store}>
          <Router history={history}>
            <Route path="/" component={App}>
              <IndexRoute component={Home}  />
              <Redirect from="users/:uid" to="users/:uid/posts" />
              <Route path="users/:uid/:page" component={Profile} />
              <Route path="tags/:hash" component={Tag} />
            </Route>
          </Router>
        </Provider>
      </div>

    )}
  }
  Root.propTypes = {
    store: React.PropTypes.object.isRequired,
    history: React.PropTypes.object.isRequired
  }
