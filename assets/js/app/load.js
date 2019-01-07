window.addEventListener('load', function() {

  let board         = new Board();
  let boardRenderer = new BoardRenderer(document.getElementById('board'), board);
  let clickHandler  = new ClickHandler();
  let dragDrop      = new DragDrop();

  function _soundFromEvent(e) {
    // Where do we live "in the grid"?
    let x = e.target.getAttribute('data-x');
    let y = e.target.getAttribute('data-y');
    return [board.getSound(x, y), x, y];
  }

  function loadSound(e) {
    // Only parse the first file, we expect no more
    let file = e.dataTransfer.files[0];
    let mp3File = new Mp3File(file);

    // Find our sound
    let [sound, x, y] = _soundFromEvent(e);
    sound = sound || new Sound();

    // Update that position
    sound.mp3File = mp3File;
    board.placeSound(x, y, sound);

    // Rerender the board (this needs to be improved)
    window.setTimeout(function() {
      boardRenderer.render();
    }, 300);
  }

  function pushSound(e) {
    let [sound] = _soundFromEvent(e);
    if ( sound ) { sound.push(); }
  }

  function releaseSound(e) {
    let [sound] = _soundFromEvent(e);
    if ( sound ) { sound.release(); }
  }

  // GO!

  dragDrop.register('.sound', loadSound);

  clickHandler.register('.sound', {
    mousedown: pushSound,
    mouseup:   releaseSound
  });

  boardRenderer.render();

});
