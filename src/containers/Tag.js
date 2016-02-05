import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Likes from '../components/Likes'
import Tags from '../components/Tags'
import { ping, echo, like, fetchTags } from '../actions/messageAction'

class Tag extends React.Component {

  render(){
    const {auth, message,  ping, echo, like, fetchTags } = this.props
    const { hash } = this.props.params
    const messages = (message.tags[hash])? message.tags[hash] : []
    return (
      <div className="page-content">
		<div className="mdl-grid">
			<div className="mdl-layout-spacer"></div>
			<Tags
				auth={auth}
				hash={hash}
				messages={messages}
				echo={echo}
				like={like}
				fetchTags={fetchTags} />
			<div className="mdl-layout-spacer"></div>
		</div>
      </div>
    )
  }
}
Tag.propTypes = {
  message: React.PropTypes.object.isRequired,
  echo: React.PropTypes.func.isRequired,
  like: React.PropTypes.func.isRequired,
  fetchTags: React.PropTypes.func.isRequired
}

export default connect(state => state, {
  echo,
  like,
  fetchTags
})(Tag)
