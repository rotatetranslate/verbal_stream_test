$(function() {

  $('#sendfile').on('click', analyzeFile);
  // $('#analysis').on('click', check);

  function getAccessToken() {
    console.log('retreiving access token...');
    return $.post('/token')
      .done(function(data) {
        console.log(data);
        window.localStorage.setItem('bvToken', data.token);
      });
  }

  function startSession() {
    console.log('starting analysis session...');
    return $.post('/start', {token: localStorage.getItem('bvToken')})
      .done(function(data) {
        console.log(data);
        return data.recordingId;
      })
  }

  function upstream(id) {
    console.log('sending .wav for analysis...');
    return $.post('/upstream', {
      token: localStorage.getItem('bvToken'),
      recordingId: id.recordingId,
      wav: $('#file').val()
    })
      .done(function(data) {
        console.log(data);
      })
  }

  function analyzeFile() {
    // console.log($('#file'));
    return getAccessToken()
      .then(function() {
        return startSession()
          .then(function(id) {
            return upstream(id)
          })
      });
  }

});
