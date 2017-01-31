const express = require('express');
const router = express.Router();
const speech = require('google-speech-api');
const fs = require('fs');
const fileType = require('file-type');
const readChunk = require('read-chunk');

//function will check if a directory exists, and create it if it doesn't
function checkDirectory(directory, callback) {
  fs.stat(directory, function(err, stats) {
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

router.post('/', function(req, res) {

  req.pipe(req.busboy);

  req.busboy.on('file', function(fieldname, file, filename) {

    checkDirectory(__dirname + '/files/', function(err) {

      if (err) {
        return err;
      } else {

        const fstream = fs.createWriteStream(__dirname + '/files/' + filename);

        file.pipe(fstream);

        fstream.on('close', function() {

          const buffer = readChunk.sync(__dirname + '/files/' + filename, 0, 4100);
          const fileExt = fileType(buffer);

          const opts = {
            file: __dirname + '/files/' + filename,
            key: 'AIzaSyA0_hF7fdP2iKlNYhCVfPvApchZmxYBqD8',
            filetype: fileExt.ext
          };

          speech(opts, function(err, results) {

            if (err) {
              console.dir(err);
              return err;
            }

            console.log(results);
            res.send('Post page');
            // [{result: [{alternative: [{transcript: '...'}]}]}]
          });

        });

      }

    });

  });

});

module.exports = router;