import React from 'react'
import Message from './Message'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class Timeline extends React.Component {
  constructor(props){
    super(props)
    this.handleMoreClick = this.handleMoreClick.bind(this)
  }

  componentWillMount(){
    const now = Date.now()
    this.props.listenMessages(now)
    this.props.fetchMessage(now)
  }

  componentDidMount(){
    this.componentDidUpdate()
  }
  componentDidUpdate(){
    componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.moreButton))
  }

  handleMoreClick(){
    const { timeline } = this.props
    const last = timeline[timeline.length - 1]
    const timestamp = (last)? last.createdAt : Date.now()
    this.props.fetchMessage(timestamp)
  }

  render(){
    const { auth, timeline, echo, like } = this.props
    const messageList = timeline.map(message => {
      return (
        <Message key={message.mid} auth={auth} message={message} echo={echo} like={like}/>
      )
    })
    return (
      <div className="mdl-grid">
        <div className="mdl-layout-spacer"></div>
        <div className=" mdl-cell mdl-cell--6-col ">
          <ReactCSSTransitionGroup transitionName="timeline" transitionEnterTimeout={1000} transitionLeaveTimeout={300}>
            {messageList}
          </ReactCSSTransitionGroup>
          <button
            ref="moreButton"
            onClick={this.handleMoreClick}
            className="mdl-cell mdl-cell--12-col mdl-button mdl-js-button mdl-js-ripple-effect "> More </button>
        </div>
        <div className="mdl-layout-spacer"></div>
      </div>
    )
  }
}
