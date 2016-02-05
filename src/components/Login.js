import React from 'react'
import ReactDOM from 'react-dom'

export default class Login extends React.Component {
  constructor(props){
    super(props)
    this.handleLoginClick = this.handleLoginClick.bind(this)
  }

  componentDidMount(){
    this.componentDidUpdate()
  }
  componentDidUpdate(){
    componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.loginButton))
  }

  handleLoginClick(event){
    this.props.loginHandler()
  }

  render(){
    return (
      <div className="mdl-grid">
        <div className="mdl-layout-spacer"></div>
        <div className="mdl-cell mdl-cell--6-col">
          <button
            onClick={this.handleLoginClick}
            id="loginButton"
            ref="loginButton"
            className="mdl-cell mdl-cell--12-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--accent">
            <span className="fa fa-twitter">Login</span>
          </button>
        </div>
        <div className="mdl-layout-spacer"></div>
      </div>
    )
  }
}
