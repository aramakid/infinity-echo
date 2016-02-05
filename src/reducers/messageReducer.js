import Immutable from 'immutable'
import {
  PING_REQUEST,
  PING_SUCCESS,
  PING_FAILURE,
  ECHO_REQUEST,
  ECHO_SUCCESS,
  ECHO_FAILURE,
  LIKE_REQUEST,
  LIKE_SUCCESS,
  LIKE_FAILURE,
  UNLIKE_REQUEST,
  UNLIKE_SUCCESS,
  UNLIKE_FAILURE,
  POST_RGISTER_REQUEST,
  POST_RGISTER_SUCCESS,
  POST_RGISTER_FAILURE,
  FETCH_MESSAGE_REQUEST,
  FETCH_MESSAGE_SUCCESS,
  FETCH_MESSAGE_FIALUER,
  LISTEN_MESSAGE_START,
  NEW_MESSAGE_COMMING,
  FETCH_LIKES_REQUEST,
  FETCH_LIKES_SUCCESS,
  FETCH_LIKES_FIALUER,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FIALUER

} from '../actions/messageAction'

var handler = {}

handler[LISTEN_MESSAGE_START] = (state, action) => {
  return Immutable.Map(state).set('isListen', true).toJS()
}

function devideMessages(messages, condition){
  for(var i = messages.length - 1; i >= 0; i--){
    if(condition(messages[i])){
      break;
    }
  }
  return {first: messages.slice(0, i + 1), last:messages.slice(i + 1, messages.length)}
}

function insertMessage(timeline, message){
  const division = devideMessages(timeline,(timeline) => timeline.createdAt >= message.createdAt)
  if(division.first.length > 0 && division.first[division.first.length - 1].mid === message.mid){
    return timeline
  }
  return [...division.first, message, ...division.last]
}

handler[FETCH_MESSAGE_SUCCESS] = (state, action) => {
  const timeline = insertMessage(state.timeline, action.message)
  return (timeline === state.timeline)? state : Immutable.Map(state).set('timeline', timeline).toJS()
}

handler[NEW_MESSAGE_COMMING] = (state, action) => {
  const timeline = Immutable.List(state.timeline).unshift(action.message).toArray()
  return Immutable.Map(state).set('timeline', timeline).toJS()
}

handler[PING_REQUEST] = (state, action) => {
  return Immutable.Map(state).set('isPosting', true).toJS()
}
handler[PING_SUCCESS] = handler[ECHO_SUCCESS] = (state, action) => {
  return Immutable.Map(state).set('isPosting', false).toJS()
}

handler[PING_FAILURE] = handler[ECHO_FAILURE] = (state, action) => {
  return Immutable.Map(state).set('isPosting', false).toJS()
}

handler[LIKE_SUCCESS] = (state, action) => {
  const timeline =  state.timeline.map(message => {
      return (message.mid === action.message.mid || message.originalPost === action.message.mid)?
        Immutable.Map(message).set('like', true).toJS() : message
  })
  const posts =  state.posts.map(message => {
      return (message.mid === action.message.mid || message.originalPost === action.message.mid)?
        Immutable.Map(message).set('like', true).toJS() : message
  })
  const likes = insertMessage(state.likes, Immutable.Map(action.message).set('like', true).toJS())
  return Immutable.Map(state)
          .set('timeline', timeline)
          .set('likes', likes)
          .set('posts', posts)
          .toJS()
}

handler[UNLIKE_SUCCESS] = (state, action) => {
  const timeline =  state.timeline.map(message => {
      return (message.mid === action.message.mid || message.originalPost === action.message.mid)?
        Immutable.Map(message).set('like', false).toJS() : message
  })
  const posts =  state.posts.map(message => {
      return (message.mid === action.message.mid || message.originalPost === action.message.mid)?
        Immutable.Map(message).set('like', false).toJS() : message
  })

  const division = devideMessages(state.likes, (like) => like.mid === action.message.mid || like.mid === action.message.originalPost)
  const likes = [
    ...division.first.slice(0, division.first.length - 1),
    ...division.last
  ]
  return Immutable.Map(state)
          .set('timeline', timeline)
          .set('likes', likes)
          .set('posts', posts)
          .toJS()
}

handler[FETCH_LIKES_REQUEST] = (state, action) => {
  if(state.profileUid === action.uid){
    return state
  }
  return Immutable.Map(state)
          .set('profileUid', action.uid)
          .set('posts', [])
          .set('likes', [])
          .toJS()
}

handler[FETCH_LIKES_SUCCESS] = (state, action) => {
  const likes = insertMessage(state.likes, action.message)
  return (likes === state.likes)? state : Immutable.Map(state).set('likes', likes).toJS()
}

handler[FETCH_POSTS_REQUEST] = (state, action) => {
  if(state.profileUid === action.uid){
    return state
  }
  return Immutable.Map(state)
          .set('profileUid', action.uid)
          .set('posts', [])
          .set('likes', [])
          .toJS()
}

handler[FETCH_POSTS_SUCCESS] = (state, action) => {
  const posts = insertMessage(state.posts, action.message)
  return (posts === state.posts)? state : Immutable.Map(state).set('posts', posts).toJS()
}

export default function messageReducer(state = {}, action){
  if(!handler[action.type]){
    return state
  }

  return handler[action.type](state, action)
}
