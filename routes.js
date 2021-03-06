const request = require('request');
// const fs = require('fs');
const express = require('express');
const record = require('node-record-lpcm16');
const router = new express.Router();

const apiKey = process.env.BV_KEY;
const tokenUri = 'https://token.beyondverbal.com/token';
const baseUri  = 'https://apiv3.beyondverbal.com/v3/recording/';

router.post('/token', (req, res, next) => {
  return request.post({
    url: tokenUri,
    form: {
      grant_type: "client_credentials",
      apiKey: apiKey
    }
  }, (err, response, body) => {
    err ? console.log(err) :
    res.send({token: JSON.parse(body).access_token})
  });
});

router.post('/start', (req, res, next) => {
  return request.post({
    url: `${baseUri}start`,
    headers: {'Authorization': `Bearer ${req.body.token}`},
    body: JSON.stringify({
      "dataFormat": {"type": "WAV"}
    })
  }, (err, response, body) => {
    return err ? console.log(err) :
    res.send(JSON.parse(body));
  });
});

router.post('/upstream', (req, res, next) => {
  return record.start({
    sampleRate : 44100,
    verbose : true
  })
  .pipe(
    request.post({
      url: `${baseUri+req.body.recordingId}`,
      headers: {'Authorization': `Bearer ${req.body.token}`}
    }, (err, response, body) => {
      return err ? console.log(err) :
      res.send(JSON.parse(body));
    })
  );
});

router.post('/analysis', (req, res, next) => {
  console.log('analysis req', req.body.offsetMs)
  return request.get({
    url: `${baseUri+req.body.recordingId}/analysis?fromMs=${req.body.offsetMs}`,
    headers: {'Authorization': `Bearer ${req.body.token}`}
  }, (err, response, body) => {
    return err ? console.log(err) :
    res.send(JSON.parse(body));
  })
})

module.exports = router;
