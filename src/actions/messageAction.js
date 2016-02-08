import Immutable from 'immutable'
import firebaseRef from './firebaseRef'
import { findTags, hashCode } from '../util'

export const POST_RGISTER_REQUEST = 'POST_RGISTER_REQUEST'
export const POST_RGISTER_SUCCESS = 'POST_RGISTER_SUCCESS'
export const POST_RGISTER_FAILURE = 'POST_RGISTER_FAILURE'

function registerPost(mid, uid, dispatch){
  dispatch({ type: POST_RGISTER_REQUEST})

  firebaseRef.child(`posts/${uid}/${mid}`).set(
    Firebase.ServerValue.TIMESTAMP
  ).then(() => {
    dispatch({ type: POST_RGISTER_SUCCESS})
  }).catch((error) => {
      if(error){
        dispatch({ type: POST_RGISTER_FAILURE, error: error })
      }
  })
}

function pingCountUp(uid){
  firebaseRef.child(`users/${uid}/pingCount`)
    .transaction(count => count + 1)
}

function echoCountUp(uid){
  firebaseRef.child(`users/${uid}/echoCount`)
    .transaction(count => count + 1)
}

function registerTags(mid, text){
  const tags = findTags(text)
  tags.forEach(tag => {
    const hash = hashCode(tag)
    firebaseRef.child(`tags/${hash}/${mid}`).set(Firebase.ServerValue.TIMESTAMP)
  })
}


export const PING_REQUEST = 'PING_REQUEST';
export const PING_SUCCESS = 'PING_SUCCESS';
export const PING_FAILURE = 'PING_FAILURE';

export function ping(text){
  return (dispatch, getState) => {
    if(getState().message.isPosting){
      return
    }
    const { auth } = getState()

    dispatch({ type: PING_REQUEST })
    const message = {
      type: 'PING',
      text: text,
      owner: auth.user.uid,
      createdAt: Firebase.ServerValue.TIMESTAMP
    }
    const messageRef = firebaseRef.child('messages').push(
      message,
      (error) => {
        if(error){
          dispatch({ type: PING_FAILURE, error: error })
        }
        if(!error){
          dispatch({ type: PING_SUCCESS })
          registerPost(messageRef.key(), auth.user.uid, dispatch)
          pingCountUp(auth.user.uid)
          registerTags(messageRef.key(), text)
        }
      }
    )
  }
}

export const ECHO_REQUEST = 'ECHO_REQUEST'
export const ECHO_SUCCESS = 'ECHO_SUCCESS'
export const ECHO_FAILURE = 'ECHO_FAILURE'

export function echo(mid, text){
  return (dispatch, getState) =>{
    const { auth } = getState()
    const message = {
      type: 'ECHO',
      owner: auth.user.uid,
      originalPost: mid,
      createdAt: Firebase.ServerValue.TIMESTAMP
    }

    const messageRef = firebaseRef.child('messages').push(
      message,
      (error) => {
        if(error){
          dispatch({ type: ECHO_FAILURE, error: error })
        }
        if(!error){
          dispatch({ type: ECHO_SUCCESS })
          registerPost(messageRef.key(), auth.user.uid, dispatch)
          echoCountUp(auth.user.uid)
          registerTags(messageRef.key(), text)
        }
      }
    )
  }
}

export const LIKE_REQUEST = 'LIKE_REQUEST'
export const LIKE_SUCCESS = 'LIKE_SUCCESS'
export const LIKE_FAILURE = 'LIKE_FAILURE'
export const UNLIKE_REQUEST = 'UNLIKE_REQUEST'
export const UNLIKE_SUCCESS = 'UNLIKE_SUCCESS'
export const UNLIKE_FAILURE = 'UNLIKE_FAILURE'

function addLike(message, likeRef, dispatch){
  likeRef.set(
    Firebase.ServerValue.TIMESTAMP
  ).then(
    dispatch({ type: LIKE_SUCCESS, message: message })
  ).catch(
    dispatch({ type: LIKE_FAILURE })
  )
}

function removeLike(message, likeRef, dispatch){
  likeRef.remove(error => {
    if(error){
      dispatch({ type: UNLIKE_FAILURE })
    }
    if(!error){
      dispatch({ type: UNLIKE_SUCCESS, message: message})
    }
  })
}

export function like(message, like){
  return (dispatch, getState) =>{
    const { auth } = getState()
    const likeRef = firebaseRef.child(`likes/${auth.user.uid}/${message.mid}`)
    if(like){
      addLike(message, likeRef, dispatch)
    }
    if(!like){
      removeLike(message, likeRef, dispatch)
    }
  }
}

export const FETCH_MESSAGE_REQUEST = 'FETCH_MESSAGE_REQUEST'
export const FETCH_MESSAGE_SUCCESS = 'FETCH_MESSAGE_SUCCESS'
export const FETCH_MESSAGE_FIALUER = 'FETCH_MESSAGE_FIALUER'


function getUser(uid){
  return firebaseRef.child(`users/${uid}`).once('value')
}

function getMessage(mid){
  return firebaseRef.child(`messages/${mid}`).once('value')
}

function getLike(uid, mid){
  return firebaseRef.child(`likes/${uid}/${mid}`).once('value')
}

function createPingMessage(data, auth){
  return new Promise( (resolve, reject) => {
    const userPromise = getUser(data.owner)
    const likePromise = getLike(auth.user.uid, data.mid)
    Promise.all([userPromise, likePromise])
      .then(values => {
        const owner =
          Immutable.Map(values[0].val())
            .set('uid', data.owner)
            .toJS()
        const like = values[1].exists()
        const message =
          Immutable.Map(data)
            .set('owner', owner)
            .set('like', like)
            .toJS()
        resolve(message)
    }).catch(error =>{
        reject(error)
    })
  })
}

function createEchoMessage(data, auth){
  return new Promise((resolve, reject) => {
    const originalPostPromise = getMessage(data.originalPost)
    const echoUserPromise = getUser(data.owner)
    Promise.all([originalPostPromise, echoUserPromise])
      .then(values => {
        const originalPost =
          Immutable.Map(values[0].val())
            .set('mid', data.originalPost)
            .toJS()
        const echoUser =
          Immutable.Map(values[1].val())
            .set('uid', data.owner)

        createPingMessage(originalPost, auth)
          .then(message => {
            const finalMessage =
              Immutable.Map(data)
                .set('text', message.text)
                .set('owner', message.owner)
                .set('like', message.like)
                .set('echoedBy', echoUser)
                .toJS()
            resolve(finalMessage)
          }).catch(error => {
            reject(error)
          })
      })
    })
}

function createMessage(data, auth){
  if(data.type == 'PING'){
    return new Promise((resolve, reject) => {
      createPingMessage(data, auth)
        .then((message) => {
          resolve(message)
        }).catch((error) => {
          reject(error)
        })
      })
  }
  if(data.type == 'ECHO'){
    return new Promise((resolve, reject) => {
      createEchoMessage(data, auth)
      .then( message => {
          resolve(message)
        }
      ).catch(error => {
        reject(error)
      })
    })
  }
}

export function fetchMessage(timestamp){
  return (dispatch, getState) => {
    const { auth } = getState()

    dispatch({ type: FETCH_MESSAGE_REQUEST })
    const query = firebaseRef.child('messages').orderByChild('createdAt').endAt(timestamp).limitToLast(20)
    query.once('value')
      .then( ref => {
        const data = Immutable.OrderedMap(ref.val()).reverse()
        data.forEach((data, key) => {
          const message = Immutable.Map(data).set('mid', key).toJS()
          createMessage(message, auth)
            .then(createdMessage => {
              dispatch({ type: FETCH_MESSAGE_SUCCESS, message: createdMessage})
            })
            .catch(error =>{
              dispatch({type: FETCH_MESSAGE_FIALUER, error: error })
            })
        })
      })
      .catch(error => {
        dispatch({type: FETCH_MESSAGE_FIALUER, error: error })
      })
  }
}

export const FETCH_LIKES_REQUEST = 'FETCH_LIKES_REQUEST'
export const FETCH_LIKES_SUCCESS = 'FETCH_LIKES_SUCCESS'
export const FETCH_LIKES_FIALUER = 'FETCH_LIKES_FIALUER'

export function fetchLikes(uid, timestamp){
  return (dispatch, getState) =>{
    const { auth } = getState()
    dispatch({ type: FETCH_LIKES_REQUEST, uid: uid})
    const query = firebaseRef.child(`likes/${uid}`).orderByValue().endAt(timestamp).limitToLast(20)
    query.once('value')
    .then(ref =>{
      const data = Immutable.OrderedMap(ref.val()).reverse()
      data.forEach((data, key) => {
        getMessage(key).then(messageRef => {
          const message = Immutable.Map(messageRef.val()).set('mid', key).toJS()
          createMessage(message, auth)
          .then(createdMessage => {
            dispatch({ type: FETCH_LIKES_SUCCESS, message: createdMessage})
          })
          .catch(error =>{
            dispatch({type: FETCH_LIKES_FIALUER, error: error })
          })
        })
      })
    })
    .catch(error =>{
      dispatch({type: FETCH_LIKES_FIALUER, error: error })
    })
  }
}

export const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST'
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS'
export const FETCH_POSTS_FIALUER = 'FETCH_POSTS_FIALUER'

export function fetchPosts(uid, timestamp){
  return (dispatch, getState) =>{
    const { auth } = getState()

    dispatch({ type: FETCH_POSTS_REQUEST, uid: uid})
    const query = firebaseRef.child(`posts/${uid}`).orderByValue().endAt(timestamp).limitToLast(20)
    query.once('value')
    .then(ref =>{
      const data = Immutable.OrderedMap(ref.val()).reverse()
      data.forEach((data, key) => {
        getMessage(key).then(messageRef => {
          const message = Immutable.Map(messageRef.val()).set('mid', key).toJS()
          createMessage(message, auth)
          .then(createdMessage => {
            dispatch({ type: FETCH_POSTS_SUCCESS, message: createdMessage})
          })
          .catch(error =>{
            dispatch({type: FETCH_POSTS_FIALUER, error: error })
          })
        })
      })
    })
    .catch(error =>{
      dispatch({type: FETCH_POSTS_FIALUER, error: error })
    })
  }
}

export const FETCH_TAGS_REQUEST = 'FETCH_TAGS_REQUEST'
export const FETCH_TAGS_SUCCESS = 'FETCH_TAGS_SUCCESS'
export const FETCH_TAGS_FIALUER = 'FETCH_TAGS_FIALUER'

export function fetchTags(hash, timestamp){
  return (dispatch, getState) =>{
    const { auth } = getState()

    dispatch({ type: FETCH_TAGS_REQUEST, hash: hash})
    const query = firebaseRef.child(`tags/${hash}`).orderByValue().endAt(timestamp).limitToLast(20)
    query.once('value')
    .then(ref =>{
      const data = Immutable.OrderedMap(ref.val()).reverse()
      data.forEach((data, key) => {
        getMessage(key).then(messageRef => {
          const message = Immutable.Map(messageRef.val()).set('mid', key).toJS()
          createMessage(message, auth)
          .then(createdMessage => {
            dispatch({ type: FETCH_TAGS_SUCCESS, message: createdMessage, hash: hash})
          })
          .catch(error =>{
            dispatch({type: FETCH_TAGS_FIALUER, error: error })
          })
        })
      })
    })
    .catch(error =>{
      dispatch({type: FETCH_TAGS_FIALUER, error: error })
    })
  }
}

export const LISTEN_MESSAGE_START = 'LISTEN_MESSAGE_START'
export const LISTEN_MESSAGE_END = 'LISTEN_MESSAGE_END'
export const NEW_MESSAGE_COMMING = 'NEW_MESSAGE_COMMING'

export function listenMessages(timestamp){
  return (dispatch, getState) => {
    const { auth } = getState()
    const { isListen } = getState().message
    if(isListen){
      return
    }
    dispatch({ type:LISTEN_MESSAGE_START })

    const query = firebaseRef.child('messages').orderByChild('createdAt').startAt(timestamp)
    query.on('child_added', data => {
      const message = Immutable.Map(data.val()).set('mid', data.key()).toJS()
      createMessage(message, auth).then(createdMessage => {
        dispatch({ type: NEW_MESSAGE_COMMING, message: createdMessage})
      })
    })
  }
}
