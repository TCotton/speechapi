const module = (function (Popcorn) {

  const _private = {

    submit: function (audioNumber) {

      let uri = '/audio?id=';
      const xhr = new XMLHttpRequest();

      xhr.open('GET', uri + audioNumber);
      xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {
          console.dir(xhr.responseText);
          const response = JSON.parse(xhr.responseText);
          document.querySelector('.wrapper').classList.remove('opacity20');
          document.querySelector('.loading-wrapper').classList.add('visuallyhidden');
          document.querySelector('.audio').src = response.uri;
          document.querySelector('.audio').autoplay = true;
          document.querySelector('.display-text').innerHTML = '<strong>Transcription: </strong><em>' + response.transcription + '</em>';
        }

      };

      xhr.send();

    },

    onDrop: function () {

      document.querySelectorAll('.audio-section').forEach((item) => {
        item.addEventListener('dragstart', function (event) {
          event.dataTransfer.setData('text/plain', event.target.dataset.audio);
          event.dataTransfer.effectAllowed = 'copyMove';
          event.dataTransfer.dropEffect = 'copy';
        });
      });

      document.querySelector('.audio-section:first-of-type');

      document.querySelector('header').addEventListener('dragover', function (e) {
        e.preventDefault();
      });

      document.querySelector('header').addEventListener('dragenter', function (e) {
        e.preventDefault();
      });

      document.querySelector('header').addEventListener('drop', function (event) {
        const data = event.dataTransfer.getData('text/plain');
        document.querySelector('.wrapper').classList.add('opacity20');
        document.querySelector('.loading-wrapper').classList.remove('visuallyhidden');
        _private.submit(data);
      });

    },

    popcorn: function () {

      Popcorn('#audio-example', {
        defaults: {
          subtitle: {
            target: 'footnote'
          }
        }
      });

    }

  };

  return {
    facade: function () {
      _private.onDrop();
      // _private.popcorn();
    }
  }

}(Popcorn));

module.facade();