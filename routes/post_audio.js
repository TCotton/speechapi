const express = require('express');
const router = express.Router();

// Your Google Cloud Platform project ID
const projectId = require('../keys.js').API;
const Speech = require('@google-cloud/speech');

const speechClient = Speech({
  projectId: projectId,
  // Or the contents of the key file:
  credentials: require('../MyProject-ff36826dd0b9.json')
});

// The audio file's encoding and sample rate
const options = {
  encoding: 'FLAC',
  sampleRate: 44100
};

function getAudioData(type) {

  const audioURI = {
    '1': function() {
      return 'audio-samples/testing-one.flac';
    },
    '2': function() {
      return 'audio-samples/testing-two.flac';
    },
    '3': function() {
      return 'audio-samples/testing-three.flac';
    },
    '4': function() {
      return 'audio-samples/marx-audio.flac';
    }
  };

  return audioURI[type]();
}

router.get('/', function(req, res) {

  // Detects speech in the audio file
  speechClient.recognize('public/' + getAudioData(req.query.id), options).then(function(results) {

    const transcription = results[0];

    res.json({ uri: getAudioData(req.query.id), transcription });

  }).catch(function(error) {

    res.json({ uri: getAudioData(req.query.id), transcription: error });

  });

});

module.exports = router;