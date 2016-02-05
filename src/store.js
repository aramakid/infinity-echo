var store = {
  routing :{/* react-router */},
  auth: {
    user: {
      id: 'twitter.id',
      avatar: 'http://xxxx.png',
      displayName: 'user'
    }
  },
  timeline: {
    messages: [
      {
        id: "xxxxx",
        text: "hello",
        owner: {
          id : 'twitter.id',
          avatar: 'http://xxxx.png',
          displayName: 'user'
        },
        date: 12345236723,
        echoed: [
          {"twitter.id": 786938740123}
        ]
      }
    ]
  },
  profile: {
    id: 'twitter.id',
    avatar: 'http://xxxx.png',
    displayName: 'user',
    messages: [
      {
        id: "xxxxx",
        text: "hello",
        owner: {
          id : 'twitter.id',
          avatar: 'http://xxxx.png',
          displayName: 'user'
        },
        date: 12345236723,
        echoed: [
          {"twitter.id": 786938740123}
        ]
      }
    ]
  },
  likes: {
    messages: [
      {
        id: "xxxxx",
        text: "hello",
        owner: {
          id : 'twitter.id',
          avatar: 'http://xxxx.png',
          displayName: 'user'
        },
        date: 12345236723,
        echoed: [
          {"twitter.id": 786938740123}
        ]
      }
    ]
  }
}
