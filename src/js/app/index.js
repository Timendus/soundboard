require('../../css/index.scss');

import Board         from './model/board';
import Sound         from './model/sound';
import Mp3File       from './model/mp3file';
import Midi          from './util/midi';
import Keyboard      from './util/keyboard';
import BoardRenderer from './board-renderer';
import Thimbleful    from 'thimbleful';

window.addEventListener('load', function() {

  require('./util/pwa');

  let board         = new Board();
  let boardRenderer = new BoardRenderer(document.getElementById('board'), board);
  let clickHandler  = Thimbleful.Click.instance();
  let dragDrop      = Thimbleful.FileTarget.instance();
  let midi          = new Midi();
  let keyboard      = new Keyboard();

  let rows = Math.round(window.innerHeight/150);
  let cols = Math.round(window.innerWidth/200);

  board.rows = rows;
  board.cols = cols;

  function _soundFromEvent(e) {
    // Where do we live "in the grid"?
    let x = e.target.closest('.sound').getAttribute('data-x');
    let y = e.target.closest('.sound').getAttribute('data-y');
    return [board.getSound(x, y), x, y];
  }

  function loadSound(file, data, e) {
    // Only parse the first file, we expect no more
    let mp3File = new Mp3File(file, data);

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

  function trigger(e, redraw, callback) {
    let [sound] = _soundFromEvent(e);
    if ( !sound ) { return; }
    callback(sound);
    if ( redraw ) {
      boardRenderer.render();
    }
  }

  function setColour(e) {
    let [sound] = _soundFromEvent(e);
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

  // GO!

  dragDrop.register('.sound:not(.loaded)', loadSound);

  clickHandler.register('body:not(.settings) .sound', {
    mousedown: (e) => { trigger(e, false, (s) => s.push()) },
    mouseup:   (e) => { trigger(e, false, (s) => s.release()) }
  });

  midi.register({
    keyDown: (e) => { console.log(e) },
    keyUp:   (e) => { console.log(e) }
  });

  keyboard.register({
    keyDown: (e) => { console.log(e) },
    keyUp:   (e) => { console.log(e) }
  });

  // Sound settings
  clickHandler.register('button[data-mode=retrigger]', { click: (e) => { trigger(e, true, (s) => s.setPlayModeRetrigger()) } });
  clickHandler.register('button[data-mode=oneshot]',   { click: (e) => { trigger(e, true, (s) => s.setPlayModeOneShot())   } });
  clickHandler.register('button[data-mode=gate]',      { click: (e) => { trigger(e, true, (s) => s.setPlayModeGate())      } });

  clickHandler.register('button.colour',       { click: setColour });
  clickHandler.register('button.save-colour',  { click: setColour });
  clickHandler.register('button.show-modes',   { click: (e) => { show(e, '.modes'); } });
  clickHandler.register('button.show-colours', { click: (e) => { show(e, '.colours'); } });

  // Navigation
  clickHandler.register('button#add-row',  { click: () => { board.addRow();    boardRenderer.render(); } });
  clickHandler.register('button#add-col',  { click: () => { board.addColumn(); boardRenderer.render(); } });
  clickHandler.register('button#settings', { click: () => { document.querySelector('body').classList.toggle('settings'); } });

  boardRenderer.render();

});
