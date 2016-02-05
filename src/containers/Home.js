import React from 'react'
import { connect } from 'react-redux'
import PingForm from '../components/PingForm'
import Timeline from '../components/Timeline'
import Login from '../components/Login'
import {loginAttempt } from '../actions/authAction'
import { ping, echo, like, listenMessages, fetchMessage } from '../actions/messageAction'

class Home extends React.Component {
  render(){
    const {auth, message, loginAttempt, ping, echo, like, listenMessages, fetchMessage } = this.props
    return (
      <div className="page-content">
        {!auth.isLogin &&
          <Login loginHandler={loginAttempt} />
        }
        {auth.isLogin &&
          <PingForm pingHandler={ping}/>
        }
        <Timeline
            auth={auth}
            timeline={message.timeline}
            echo={echo}
            like={like}
            listenMessages={listenMessages}
            fetchMessage={fetchMessage} />
      </div>
    )
  }
}
Home.propTypes = {
  auth: React.PropTypes.object.isRequired,
  message: React.PropTypes.object.isRequired,
  loginAttempt: React.PropTypes.func.isRequired,
  ping: React.PropTypes.func.isRequired,
  echo: React.PropTypes.func.isRequired,
  like: React.PropTypes.func.isRequired,
  listenMessages: React.PropTypes.func.isRequired,
  fetchMessage: React.PropTypes.func.isRequired
}

export default connect(state => state, {
  loginAttempt,
  ping,
  echo,
  like,
  listenMessages,
  fetchMessage
})(Home)
