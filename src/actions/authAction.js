import firebaseRef from './firebaseRef'

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export function logout(){
  return (dispatch, getState) => {
    dispatch({ type: LOGOUT_REQUEST })
    firebaseRef.unauth()
  }
}

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST'
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE'

function updateUser(auth, dispatch){
  firebaseRef.child("users").child(auth.uid).update(
    {
      name: auth.twitter.username,
      displayName: auth.twitter.displayName,
      avatar: auth.twitter.profileImageURL
    }).then(() => {
      dispatch({ type: UPDATE_USER_SUCCESS, auth: auth })
    }).catch( error => {
      dispatch({ type: UPDATE_USER_FAILURE, error: error })
    })
}


export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'


export function listenAuth(){
  return (dispatch, getState) => {
    firebaseRef.onAuth(auth => {
      if(auth){
        dispatch({ type: LOGIN_SUCCESS, auth: auth })
        updateUser(auth, dispatch)
      }
      if(!auth){
        dispatch({ type: LOGOUT_SUCCESS })
      }
    })
  }
}


export function loginAttempt(){
  return (dispatch, getState) => {
    dispatch({ type: LOGIN_ATTEMPT })
    const { auth } = getState()
    if(auth && auth.isLogin){
      dispatch({ type: LOGIN_SUCCESS, auth: auth })
      return;
    }

    firebaseRef.authWithOAuthRedirect("twitter", error =>
      dispatch({ type: LOGIN_FAILURE, error: error })
    )
  }
}
