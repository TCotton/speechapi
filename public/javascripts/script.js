const module = (function() {

  const _private = {

    formSubmit: function() {

      document.querySelector('.pure-form').addEventListener('submit', function(e) {

        e.preventDefault();

        if (!e.target.querySelector('#audio-file').files[0]) {
          return;
        }

        const uri = '/audio';
        const xhr = new XMLHttpRequest();
        const fd = new FormData();

        xhr.open('POST', uri, true);
        xhr.onreadystatechange = function() {

          if (xhr.readyState === 4 && xhr.status === 200) {
            alert(xhr.responseText);
          }

        };

        fd.append('audioFile', e.target.querySelector('#audio-file').files[0]);
        xhr.send(fd);

      });

    }

  };

  return {
    facade: function() {
      _private.formSubmit();
    }
  }

}());

module.facade();