import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Likes from '../components/Likes'
import Posts from '../components/Posts'
import { ping, echo, like, fetchLikes, fetchPosts } from '../actions/messageAction'

class Profile extends React.Component {
  componentDidMount(){
    this.componentDidUpdate()
  }
  componentDidUpdate(){
    componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.postsButton))
    componentHandler.upgradeElement(ReactDOM.findDOMNode(this.refs.likesButton))
  }

  render(){
    const {auth, message,  ping, echo, like, fetchLikes, fetchPosts } = this.props
    const { uid, page }= this.props.params
    const view = (page === 'posts')? (
      <Posts
          auth={auth}
          uid={uid}
          posts={message.posts}
          echo={echo}
          like={like}
          fetchPosts={fetchPosts} />

    ) : (
      <Likes
        auth={auth}
        uid={uid}
        likes={message.likes}
        echo={echo}
        like={like}
        fetchLikes={fetchLikes} />
    )

    return (
      <div className="page-content">
        <div className="mdl-grid">
          <Link to={`/users/${uid}/posts`}
            ref="postsButton"
            className="mdl-cell mdl-cell--6-col mdl-button mdl-js-button mdl-js-ripple-effect "> posts </Link>
          <Link to={`/users/${uid}/likes`}
            ref="likesButton"
            className="mdl-cell mdl-cell--6-col mdl-button mdl-js-button mdl-js-ripple-effect "> likes </Link>
        </div>
        <div className="mdl-grid">
          <div className="mdl-layout-spacer"></div>
            {view}
          <div className="mdl-layout-spacer"></div>
        </div>
      </div>
    )
  }
}
Profile.propTypes = {
  message: React.PropTypes.object.isRequired,
  echo: React.PropTypes.func.isRequired,
  like: React.PropTypes.func.isRequired,
  fetchLikes: React.PropTypes.func.isRequired,
  fetchPosts: React.PropTypes.func.isRequired
}

export default connect(state => state, {
  echo,
  like,
  fetchLikes,
  fetchPosts
})(Profile)
