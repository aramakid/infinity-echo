import React from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import { Link } from 'react-router'
import marked from 'marked'
import { addTagLink } from '../util'

export default class Message extends React.Component {
  constructor(props){
    super(props)
    this.handleLike = this.handleLike.bind(this)
    this.handleEcho = this.handleEcho.bind(this)
    marked.setOptions({sanitize: true})
  }

  componentDidMount(){
    this.componentDidUpdate()
  }
  componentDidUpdate(){
    if(this.props.auth.isLogin){
      componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.likeButton))
      componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.echoButton))
    }
  }

  handleLike(event){
    const { message } = this.props
    const like = event.target.checked
    this.props.like(message, like)
  }

  handleEcho(){
    const { message } = this.props
    const mid = (message.type === 'PING')? message.mid : message.originalPost
    this.props.echo(mid, message.text)
  }

  render(){
    const { auth, message } = this.props
    const date = new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(new Date(message.createdAt))
    const likeClassName = message.like? 'favorite' : 'favorite_border'

    return (
      <div className="message mdl-card mdl-cell mdl-cell--12-col mdl-shadow--2dp">
        <Link to={`/users/${message.owner.uid}`} className="avatar mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab mdl-js-ripple-effect  mdl-shadow--2dp">
          <img src={message.owner.avatar} />
        </Link>
        <div className="mdl-card__supporting-text" dangerouslySetInnerHTML={{__html: marked(addTagLink(message.text))}} />
        {auth.isLogin &&
          <div className="mdl-card__menu">
            <label ref="likeButton" className="mdl-icon-toggle mdl-js-icon-toggle mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" htmlFor={`like-${message.mid}`} >
              <input type="checkbox" id={`like-${message.mid}`} className="mdl-icon-toggle__input"
                checked={message.like}
                onChange={this.handleLike} />
              <i className="material-icons mdl-color-text--pink-200">{likeClassName}</i>
            </label>
            <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect"
              ref="echoButton"
              onClick={this.handleEcho}>
              <i className="material-icons  mdl-color-text--pink-200">cast</i>
            </button>
          </div>
        }
        <div className="message__footer" >
          <div className="mdl-layout-spacer" />
          <div >
            {message.type === 'ECHO' &&
              <div className="mdl-color-text--grey-300">
                echoed by{' '}
                <Link to={`/users/${message.echoedBy.uid}`} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
                  <img className="avater--min" src={message.echoedBy.avatar} />
                </Link>
              </div>
            }
            <span className="mdl-color-text--grey-300">{date}</span>
          </div>
        </div>
      </div>
    )
  }
}
