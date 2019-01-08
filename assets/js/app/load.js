window.addEventListener('load', function() {

  let board         = new Board();
  let boardRenderer = new BoardRenderer(document.getElementById('board'), board);
  let clickHandler  = new ClickHandler();
  let dragDrop      = new DragDrop();

  function _soundFromEvent(e) {
    // Where do we live "in the grid"?
    let x = e.target.closest('.sound').getAttribute('data-x');
    let y = e.target.closest('.sound').getAttribute('data-y');
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
    }, 100);
  }

  function pushSound(e) {
    let [sound] = _soundFromEvent(e);
    if ( sound ) { sound.push(); }
  }

  function releaseSound(e) {
    let [sound] = _soundFromEvent(e);
    if ( sound ) { sound.release(); }
  }

  function setOneShot(e) {
    let [sound] = _soundFromEvent(e);
    if ( sound ) { sound.setPlayModeOneShot(); }
    boardRenderer.render();
  }

  function setStartStop(e) {
    let [sound] = _soundFromEvent(e);
    if ( sound ) { sound.setPlayModeStartStop(); }
    boardRenderer.render();
  }

  function setHold(e) {
    let [sound] = _soundFromEvent(e);
    if ( sound ) { sound.setPlayModeHold(); }
    boardRenderer.render();
  }

  function setColour(e) {
    let [sound] = _soundFromEvent(e);
    if ( sound ) { sound.colour = e.target.closest('.sound').querySelector('input').value; }
    boardRenderer.render();
  }

  // GO!

  dragDrop.register('.sound', loadSound);

  clickHandler.register('.sound', {
    mousedown: pushSound,
    mouseup:   releaseSound
  });

  clickHandler.register('button.one-shot',    { click: setOneShot   });
  clickHandler.register('button.start-stop',  { click: setStartStop });
  clickHandler.register('button.hold',        { click: setHold      });
  clickHandler.register('button.save-colour', { click: setColour    });

  boardRenderer.render();

});
