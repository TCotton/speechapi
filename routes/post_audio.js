const express = require('express');
const router = express.Router();
const speech = require('google-speech-api');
const fs = require('fs');
const fileType = require('file-type');
const readChunk = require('read-chunk');

// [START speech_quickstart]
// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');

// Your Google Cloud Platform project ID
const projectId = require('../keys.js');


// [START speech_async_recognize]
function asyncRecognize(filename) {
  // Instantiates a client
  const speech = Speech();

  const config = {
    // Configure these settings based on the audio you're transcribing
    encoding: 'LINEAR16',
    sampleRate: 16000
  };

  // Detects speech in the audio file, e.g. "./resources/audio.raw"
  // This creates a recognition job that you can wait for now, or get its result
  // later.
  return speech.startRecognition(filename, config)
    .then((results) => {
      const operation = results[0];
      // Get a Promise represention the final result of the job
      return operation.promise();
    })
    .then((transcription) => {
      console.log(`Transcription: ${transcription}`);
      return transcription;
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

    checkDirectory(__dirname + '/files/', function (err) {

      if (err) {
        return err;
      } else {

        const fstream = fs.createWriteStream(__dirname + '/files/' + filename);

        file.pipe(fstream);

        fstream.on('close', function () {

          const buffer = readChunk.sync(__dirname + '/files/' + filename, 0, 4100);
          const fileExt = fileType(buffer);

          asyncRecognize(__dirname + '/files/' + filename).then(function (returnedData) {
            res.send(JSON.stringify(returnedData));
          });

        });

      }

    });

  });

});

module.exports = router;