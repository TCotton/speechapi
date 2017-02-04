const express = require('express');
const router = express.Router();
const speech = require('google-speech-api');
const fs = require('fs');
const fileType = require('file-type');
const readChunk = require('read-chunk');
const util = require('util');

// [START speech_quickstart]
// Imports the Google Cloud client library

// Your Google Cloud Platform project ID
const projectId = require('../keys.js');

const Speech = require('@google-cloud/speech')({
  projectId: projectId,
  // Or the contents of the key file:
  credentials: require('../MyProject-ff36826dd0b9.json')
});

// [START speech_sync_recognize]
function syncRecognize(filename) {
  // Instantiates a client

  const config = {
    // Configure these settings based on the audio you're transcribing
    encoding: 'LINEAR16',
    sampleRate: 16000
  };

  // Detects speech in the audio file, e.g. "./resources/audio.raw"
  return Speech.recognize(filename, config)
    .then((results) => {
      const transcription = results[0];
      console.log(`Transcription: ${transcription}`);
      return transcription;
    }).catch((error) => {
      console.log(`Error: ${error}`);
    });
}
// [END speech_sync_recognize]


// [START speech_async_recognize]
function asyncRecognize(filename) {

  const config = {
    // Configure these settings based on the audio you're transcribing
    encoding: 'LINEAR16',
    sampleRate: 16000
  };

  // Detects speech in the audio file, e.g. "./resources/audio.raw"
  // This creates a recognition job that you can wait for now, or get its result
  // later.
  return Speech.startRecognition(filename, config)
    .then((results) => {
      const operation = results[0];
      // Get a Promise represention the final result of the job
      return operation.promise();
    })
    .then((transcription) => {
      console.log(`Transcription: ${transcription}`);
      return transcription;
    }).catch((failed) => {
      console.log(`failed: ${failed}`);
      return failed;
    });
}
// [END speech_async_recognize]

//function will check if a directory exists, and create it if it doesn't
function checkDirectory(directory, callback) {
  fs.stat(directory, function (err) {
    //Check if error defined and the error code is "not exists"
    if (err && err.errno === 34) {
      //Create the directory, call the callback.
      fs.mkdir(directory, callback);
    } else {
      //just in case there was a different error:
      callback(err)
    }
  });
}

function getAudioData(type) {

  const audioURI = {
    '1': function () {
      return 'audio-samples/testing-one.flac';
    },
    '2': function () {
      return 'audio-samples/testing-two.flac';
    },
    '3': function () {
      return 'audio-samples/testing-three.flac';
    },
    '4': function () {
      return 'audio-samples/marx-audio.flac';
    }
  };

  return audioURI[type]();
}

router.get('/', function (req, res) {

  console.log('router.get');
  console.log(req.params.id);

  res.json({id: req.param('id')});

/*  asyncRecognize('public/' + getAudioData(req.param('id'))).then(function (returnedData) {
    console.dir(returnedData);
  });*/

});

module.exports = router;