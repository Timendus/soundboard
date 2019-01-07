window.addEventListener('load', function() {

  var clickHandler = new ClickHandler();
  var dragDrop = new DragDrop();

  dragDrop.register('.sound', loadSong);
  clickHandler.register('.sound', playSong);

  function loadSong(e) {
    var files = e.dataTransfer.files;
    var sound = e.target;

    for(var j=0; j<files.length; j++){
    	if(files[j].type.match(/audio\/(mp3|mpeg)/)){

        // Put the audio file in the relevant audio tag
        var reader = new FileReader();
        reader.onload = function(data) {
      		sound.querySelector('audio').src = data.currentTarget.result;
      	};
      	reader.readAsDataURL(files[j]);

        // Update button with ID3 tags
        window.jsmediatags.read(files[j], {
          onSuccess: function(tag) {
            console.log(tag);
            sound.querySelector('h1').innerText = tag.tags.title || "Unknown song";
            sound.querySelector('p').innerText = tag.tags.artist || "";
            sound.classList.add('loaded');
          },
          onError: function(error) {
            console.error(error);
          }
        });
    	}
    }

    console.log("Thing dropped: done!");
  }

  function playSong(e) {
    var audio = e.target.querySelector('audio');
    audio.load();
    audio.play();
  }

});
