const express = require('express');
const router = express.Router();
const speech = require('google-speech-api');
const fs = require('fs');
const fileType = require('file-type');
const readChunk = require('read-chunk');
const AV = require('av');

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

router.post('/', function (req, res) {

  req.pipe(req.busboy);

  req.busboy.on('file', function (fieldname, file, filename) {

    const fstream = fs.createWriteStream(__dirname + '/files/' + filename);

    file.pipe(fstream);

    fstream.on('close', function () {

      console.dir(global.AudioContext);

      const asset = AV.Asset.fromFile(__dirname + '/files/' + filename);
      asset.get('duration', function(duration) {
        console.dir(duration);
        // do something
        res.send(true);
      });

    /*  const buffer = readChunk.sync(__dirname + '/files/' + filename, 0, 4100);
      const fileExt = fileType(buffer);

      asyncRecognize(__dirname + '/files/' + filename).then(function (returnedData) {
        console.dir(returnedData);
        res.send(JSON.stringify(returnedData));
      });*/

    });

  });

});

module.exports = router;