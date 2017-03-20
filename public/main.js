// const analyzeSpeech = () => getAccessToken().then(() => startSession().then(id => upstream(id)));

document.querySelector('#start').addEventListener('click', analyzeSpeech);

function analyzeSpeech() {
  return getAccessToken()
  .then(function() {
    return startSession()
    .then(function(id) {
      upstream(id)
      return analysis(id)
    })
  })
}

function getAccessToken() {
  console.log('retrieving access token...');
  return fetch('/token', {
    method: 'post'
  })
  .then(res => res.json())
  .then(data => {
    window.localStorage.setItem('bvToken', data.token)
  })
  .catch(err => console.log(err))
}

function startSession() {
  console.log('starting analysis section...');
  return fetch('/start', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: localStorage.getItem('bvToken')
    })
  })
  .then(res => res.json())
  .then(data => data.recordingId)
  .catch(err => console.log(err))
}

function upstream(id) {
  console.log('recording...');
  return fetch('/upstream', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: localStorage.getItem('bvToken'),
      recordingId: id
    })
  })
  .then(res => res.json())
  .then(data => console.log('upstream data ', data))
  .catch(err => console.log(err))
}

function analysis(id, offsetMs = 0) {
  console.log('retrieving intermediary analysis...');
  return fetch('/analysis', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: localStorage.getItem('bvToken'),
      recordingId: id,
      offsetMs: offsetMs
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('analysis data ', data)
    if (data.result.sessionStatus === 'Done') {
      console.log('session completed')
    } else {
      // recursively send analysis requests until recording stops
      // seems to need at least a few seconds to be able to parse any kind of data from the recording
      return setTimeout(() => {
        return analysis(id, data.result.duration)
      }, 5000)
    }
  })
  .catch(err => console.log(err))
}
