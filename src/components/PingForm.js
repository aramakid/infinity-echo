import React from 'react'
import ReactDOM from 'react-dom'

export default class PingForm extends React.Component {
  constructor(props){
    super(props)
    this.handlePingClick = this.handlePingClick.bind(this)
  }

  handlePingClick(event){
    event.preventDefault()
    const text = this.refs.text.value
    if(text.length <= 0 || text.length > 140){
      return;
    }
    this.props.pingHandler(text)
    this.refs.text.value = ''
  }

  componentDidMount(){
    this.componentDidUpdate()
  }

  componentDidUpdate(){
    componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.pingForm))
    componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.pingButton))
  }

  render(){
    return (
      <div className="mdl-grid">
        <div className="mdl-layout-spacer"></div>
        <form className="mdl-cell mdl-cell--6-col" onSubmit={this.handlePingClick}>
          <div
            ref="pingForm"
            className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--10-col">
            <input className="mdl-textfield__input" ref="text" type="text" id="ping-field" pattern=".{1,140}" />
            <label className="mdl-textfield__label" htmlFor="ping-field">Share what you're doing...</label>
          </div>
          <button
            ref="pingButton"
            onClick={this.handlePingClick}
            className="mdl-cell mdl-cell--2-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--accent"> Ping </button>
        </form>
        <div className="mdl-layout-spacer"></div>
      </div>
    )
  }
}
PingForm.propTypes = {
  pingHandler: React.PropTypes.func.isRequired
}
