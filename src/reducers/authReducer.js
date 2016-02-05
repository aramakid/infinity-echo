import {
  LOGOUT_SUCCESS,
  LOGIN_ATTEMPT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '../actions/authAction'

var handler = {}
handler[LOGIN_SUCCESS] = (state, action) => {
  return {
    isLogin : true,
    user: {
      uid: action.auth.uid,
      name: action.auth.twitter.username,
      displayName: action.auth.twitter.displayName,
      avatar: action.auth.twitter.profileImageURL
    }
  };
}

handler[LOGOUT_SUCCESS] = (state, action) => ({
  isLogin: false
})


export default function authReducer(state = {}, action){
  if(!handler[action.type]){
    return state
  }

  return handler[action.type](state, action)
}
