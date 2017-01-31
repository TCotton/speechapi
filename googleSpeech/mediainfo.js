const child_process = require('child_process');
const filesizeParser = require('filesize-parser');
const expat = require('node-expat');

module.exports = function() {

  const files = Array.prototype.slice.apply(arguments);

  console.dir(files);

  const done = files.pop();

  child_process.execFile("mediainfo", ["--Output=XML"].concat(files), (err, stdout) => {

    console.dir('before this');

    if (err) {
      return done(err);
    }

    console.dir('after this');

    const files = [];
    let file = null;
    let track = null;
    let key = null;

    const parser = new expat.Parser();

    parser.on("startElement", (name, attribs) => {
      name = name.toLowerCase();

      if (file === null && name === "file") {
        file = {tracks: []};

        for (let k in attribs) {
          file[k.toLowerCase()] = attribs[k];
        }

        return;
      }

      if (track === null && name === "track") {
        if (attribs.type === "General") {
          track = file;
        } else {
          track = {};

          for (let k in attribs) {
            track[k.toLowerCase()] = attribs[k];
          }
        }

        return;
      }

      if (track !== null) {
        key = name;
      }
    });

    parser.on("endElement", name => {
      name = name.toLowerCase();

      if (track !== null && name === "track") {
        if (track !== file) { file.tracks.push(track); }
        track = null;
      }

      if (file !== null && name === "file") {
        if (file.file_size) {
          file.file_size_bytes = filesizeParser(file.file_size);
        }

        files.push(file);

        file = null;
      }

      key = null;
    });

    parser.on("text", text => {
      if (track !== null && key !== null) {
        track[key] = (track[key] || "") + text;
      }
    });

    if (!parser.parse(stdout)) {
      return done(Error(parser.getError()));
    }

    return done(null, files);
  });
};