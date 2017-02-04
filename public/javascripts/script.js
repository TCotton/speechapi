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

    },

    onDrop: function() {

      console.log('drop here');

      document.querySelector('.audio-section:first-of-type').addEventListener('dragstart', function(event) {
        console.log('drag start');
        event.dataTransfer.setData('text/plain', 'This text may be dragged');
        event.dataTransfer.effectAllowed = 'copyMove';
        event.dataTransfer.dropEffect = 'copy';
        console.dir(event.dataTransfer);
      });

      document.querySelector('.header').addEventListener('dragover', function(e){
        console.log('here');
        console.log('dragover');
        e.preventDefault();
      });

      document.querySelector('.header').addEventListener('dragenter', function(e){
        console.log('dragenter');
        e.preventDefault();
      });

      document.querySelector('.header').addEventListener('drop', function(event){
        const data = event.dataTransfer.getData('text/plain');
        console.log(data);
      });

      document.querySelector('.header').addEventListener('dragend', function(){
        console.log('dragend');
      });

    }

  };

  return {
    facade: function() {
      _private.onDrop();
    }
  }

}());

module.facade();