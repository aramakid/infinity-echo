import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { listenAuth, logout } from '../actions/authAction'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props){
    super(props)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  componentWillMount(){
    this.props.listenAuth()
  }

  handleLogoutClick(event){
    this.props.logout()
  }


  render(){
    const { children, auth } = this.props
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-title">Infinity Echo</span>
            <div className="mdl-layout-spacer"></div>
            <nav className="header-navigation android-navigation mdl-navigation">
              <Link to="/" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                <i className="material-icons">home</i>
              </Link>
              {auth.isLogin &&
                <button onClick={this.handleLogoutClick} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                  <i className="fa fa-sign-out"></i>
                </button>
              }
              {auth.isLogin &&
                <Link to={`/users/${auth.user.uid}`} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                  <img className="avater--min" src={auth.user.avatar} />
                </Link>
              }
            </nav>
          </div>
        </header>
        <main className="mdl-layout__content">
          {children}
        </main>
      </div>
    )
  }
}
App.propTypes = {
  auth: React.PropTypes.object.isRequired,
  listenAuth: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired
}
export default connect(
  state => state, {
    listenAuth,
    logout
  }
)(App)
