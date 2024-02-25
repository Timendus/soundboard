import Board         from './model/board.js';
import Sound         from './model/sound.js';
import Mp3File       from './model/mp3file.js';
import Midi          from './util/midi.js';
import Keyboard      from './util/keyboard.js';
import BoardRenderer from './board-renderer.js';
import './lib/thimbleful.js';
import './util/pwa.js';

window.addEventListener('load', function() {
  let board         = new Board();
  let boardRenderer = new BoardRenderer(document.getElementById('board'), board);
  let clickHandler  = Thimbleful.Click.instance();
  let dragDrop      = Thimbleful.FileTarget.instance();
  let midi          = new Midi();
  let keyboard      = new Keyboard();
  let volume        = 1;

  let rows = Math.round(window.innerHeight/150);
  let cols = Math.round(window.innerWidth/200);

  board.rows = rows;
  board.cols = cols;

  function _soundFromEvent(e) {
    // Where do we live "in the grid"?
    const soundElm = e.target.closest('.sound');
    const x = soundElm.getAttribute('data-x');
    const y = soundElm.getAttribute('data-y');
    return [board.getSound(x, y), x, y];
  }

  function loadSound(file, data, e) {
    // Only parse the first file, we expect no more
    const mp3File = new Mp3File(file, data);

    // Find our sound
    let [sound, x, y] = _soundFromEvent(e);
    sound = sound || new Sound();

    // Update that position
    sound.mp3File = mp3File;
    sound.x = x;
    sound.y = y;
    sound.setVolume(volume);
    board.placeSound(x, y, sound);

    // Rerender the board (this needs to be improved)
    window.setTimeout(function() {
      boardRenderer.render();
    }, 100);
  }

  function trigger(e, redraw, callback) {
    const [sound] = _soundFromEvent(e);
    if ( !sound ) return;
    callback(sound);
    if ( redraw ) boardRenderer.render();
  }

  function keyTrigger(key, callback) {
    const sound = board.getByKey(key);
    if ( !sound ) return;
    callback(sound);
  }

  function setColour(e) {
    const [sound] = _soundFromEvent(e);
    if ( !sound ) { return; }
    let colourValue;
    if ( e.target.classList.contains('save-colour') ) {
      colourValue = e.target.closest('.sound').querySelector('input').value;
    } else {
      colourValue = window.getComputedStyle(e.target).getPropertyValue('background-color');
    }
    sound.colour = colourValue;
    boardRenderer.render();
  }

  function show(e, className) {
    e.target.closest('.sound').querySelector(className).classList.add('active');
  }

  function captureKey(e) {
    show(e, '.keys');
    Promise.race([keyboard.getNextKeyPress(), midi.getNextKeyPress()])
      .then(key => {
        let [sound] = _soundFromEvent(e);
        sound.key = key;
      })
      .finally(() => {
        keyboard.cancelGetKeyPress();
        midi.cancelGetKeyPress();
        boardRenderer.render();
      });
  }

  // GO!

  dragDrop.register('.sound:not(.loaded)', loadSound);

  clickHandler.register('body:not(.settings) .sound', {
    mousedown: e => trigger(e, false, (s) => s.push()),
    mouseup:   e => trigger(e, false, (s) => s.release())
  });

  document.getElementById('volume').addEventListener('input', e => {
    volume = e.target.value;
    board.allSounds().forEach(s => s.setVolume(volume));
  });

  midi.register({
    keyDown: key => keyTrigger(key, s => s.push()),
    keyUp:   key => keyTrigger(key, s => s.release())
  });

  keyboard.register({
    keyDown: key => keyTrigger(key, s => s.push()),
    keyUp:   key => keyTrigger(key, s => s.release())
  });

  // Sound settings
  clickHandler.register('button[data-mode=retrigger]', { click: e => { trigger(e, true, s => s.setPlayModeRetrigger()); } });
  clickHandler.register('button[data-mode=oneshot]',   { click: e => { trigger(e, true, s => s.setPlayModeOneShot());   } });
  clickHandler.register('button[data-mode=gate]',      { click: e => { trigger(e, true, s => s.setPlayModeGate());      } });

  clickHandler.register('button.colour',       { click: setColour });
  clickHandler.register('button.save-colour',  { click: setColour });
  clickHandler.register('button.show-modes',   { click: e => show(e, '.modes') });
  clickHandler.register('button.show-colours', { click: e => show(e, '.colours') });
  clickHandler.register('button.assign-key',   { click: e => captureKey(e) });

  // Navigation
  clickHandler.register('button#add-row',  { click: () => { board.addRow();    boardRenderer.render(); } });
  clickHandler.register('button#add-col',  { click: () => { board.addColumn(); boardRenderer.render(); } });
  clickHandler.register('button#settings', { click: () => { document.querySelector('body').classList.toggle('settings'); } });

  boardRenderer.render();

});
