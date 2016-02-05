import React from 'react'
import Message from './Message'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class Tags extends React.Component {
  constructor(props){
    super(props)
    this.handleMoreClick = this.handleMoreClick.bind(this)
  }

  componentWillMount(){
    const { hash } = this.props
    const now = Date.now()
    this.props.fetchTags(hash, now)
  }

  componentDidMount(){
    this.componentDidUpdate()
  }
  componentDidUpdate(){
    componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.moreButton))
  }


  handleMoreClick(){
    const { messages, hash } = this.props
    const last = messages[messages.length - 1]
    const timestamp = (last)? last.createdAt : Date.now()
    this.props.fetchTags(hash, timestamp)
  }

  render(){
    const { auth, messages, echo, like } = this.props
    const messageList = messages.map(message => {
      return (
        <Message key={`post-${message.mid}`}  auth={auth} message={message} echo={echo} like={like}/>
      )
    })
    return (
        <div className=" mdl-cell mdl-cell--6-col " style={{marginTop: 48}}>
          <ReactCSSTransitionGroup transitionName="posts" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
            {messageList}
          </ReactCSSTransitionGroup>
          <button
            ref="moreButton"
            onClick={this.handleMoreClick}
            className="mdl-cell mdl-cell--12-col mdl-button mdl-js-button mdl-js-ripple-effect "> More </button>
        </div>
    )
  }
}
