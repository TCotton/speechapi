const module = (function () {

  const _private = {

    submit: function (audioNumber) {

      let uri = '/audio?id=';
      const xhr = new XMLHttpRequest();

      xhr.open('GET', uri + audioNumber);
      xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {
          console.dir(xhr.responseText);
        }

      };

      xhr.send();

    },

    onDrop: function () {

      document.querySelector('.audio-section:first-of-type').addEventListener('dragstart', function (event) {
        console.log('drag start');
        event.dataTransfer.setData('text/plain', event.target.dataset.audio);
        event.dataTransfer.effectAllowed = 'copyMove';
        event.dataTransfer.dropEffect = 'copy';
      });

      document.querySelector('header').addEventListener('dragover', function (e) {
        e.preventDefault();
      });

      document.querySelector('header').addEventListener('dragenter', function (e) {
        e.preventDefault();
      });

      document.querySelector('header').addEventListener('drop', function (event) {
        const data = event.dataTransfer.getData('text/plain');
        _private.submit(data);
        // audio-samples/marx-audio.flac
      });

    }

  };

  return {
    facade: function () {
      _private.onDrop();
    }
  }

}());

module.facade();