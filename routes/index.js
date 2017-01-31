const express = require('express');
const speech = require('google-speech-api');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'audio transcribe test' });
});

module.exports = router;
