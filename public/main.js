const analyzeVoice = () => getAccessToken().then(() => startSession().then(id => upstream(id)));

document.querySelector('#start').addEventListener('click', analyzeVoice);

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
  .then(data => console.log(data))
  .catch(err => console.log(err))
}
