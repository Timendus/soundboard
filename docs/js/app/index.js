import Board from './model/board.js';
import Sound from './model/sound.js';
import Mp3File from './model/mp3file.js';
import Midi from './util/midi.js';
import Keyboard from './util/keyboard.js';
import BoardRenderer from './board-renderer.js';
import IndexedDB from './util/indexedDB.js';
import './lib/thimbleful.js';
import './util/pwa.js';

/* Initialize all the bits and pieces */

const database = await IndexedDB.connect("soundboard");
let board = await findOrCreateBoard();
const boardRenderer = new BoardRenderer(document.getElementById('board'), board);
const clickHandler = Thimbleful.Click.instance();
const dragDrop = Thimbleful.FileTarget.instance();
const midi = new Midi();
const keyboard = new Keyboard();
let volume = 1;

/* Render the board to the DOM */

board.resizeIfEmpty(...rowsAndCols());
boardRenderer.render();

/* Register all event handlers */

// Loading sounds into the soundboard
dragDrop.register('.sound:not(.loaded)', (file, data, e) => {
  const mp3File = new Mp3File(file, data);

  // Find our sound
  let [sound, x, y] = _soundFromEvent(e);
  sound = sound || new Sound();

  // Update that position
  sound.mp3File = mp3File;
  sound.setVolume(volume);
  board.placeSound(x, y, sound);

  // Rerender the board (I think the timeout had something to do with the drag
  // and drop stuff not removing the hover class otherwise? Not sure anymore.)
  window.setTimeout(() => {
    boardRenderer.render();
  }, 10);
});

// Make the soundboard make sounds
clickHandler.register('body:not(.settings) .sound', {
  mousedown: e => trigger(e, false, (s) => s.push()),
  mouseup: e => trigger(e, false, (s) => s.release())
});
midi.register({
  keyDown: key => keyTrigger(key, s => s.push()),
  keyUp: key => keyTrigger(key, s => s.release())
});
keyboard.register({
  keyDown: key => keyTrigger(key, s => s.push()),
  keyUp: key => keyTrigger(key, s => s.release())
});

// Let the volume slider control the volume
document.getElementById('volume').addEventListener('input', e => {
  volume = e.target.value;
  board.allSounds().forEach(s => s.setVolume(volume));
});

// Configuration
clickHandler.register('button#load', { click: async () => {
  const newBoard = Board.fromStorageObject(JSON.parse(await upload()));
  board.allSounds().forEach(s => s.destroy());
  board = newBoard;
  boardRenderer.board = board;
  boardRenderer.render();
  document.querySelector('body').classList.remove('settings');
}});
clickHandler.register('button#save', { click: () => { download('soundboard.json', JSON.stringify(board.toStorageObject())); } });
clickHandler.register('button#add-row', { click: () => { board.addRow(); boardRenderer.render(); } });
clickHandler.register('button#add-col', { click: () => { board.addColumn(); boardRenderer.render(); } });
clickHandler.register('button#settings', { click: () => { document.querySelector('body').classList.toggle('settings'); } });

// Sound settings
clickHandler.register('button[data-mode=retrigger]', { click: e => { trigger(e, true, s => s.setPlayModeRetrigger()); } });
clickHandler.register('button[data-mode=oneshot]', { click: e => { trigger(e, true, s => s.setPlayModeOneShot()); } });
clickHandler.register('button[data-mode=gate]', { click: e => { trigger(e, true, s => s.setPlayModeGate()); } });

clickHandler.register('button.colour', { click: setColour });
clickHandler.register('button.save-colour', { click: setColour });
clickHandler.register('button.show-modes', { click: e => show(e, '.modes') });
clickHandler.register('button.show-colours', { click: e => show(e, '.colours') });
clickHandler.register('button.assign-key', { click: e => captureKey(e) });

// Save soundboard when the window loses focus
window.addEventListener('visibilitychange', async () => {
  if (document.visibilityState == "hidden") {
    await database.setItem('autosave', board.toStorageObject());
    console.log("💾 Saved board to IndexedDB");
  }
});

// Resize the soundboard when resizing the window
window.addEventListener('resize', () => {
  board.resizeIfEmpty(...rowsAndCols());
  boardRenderer.render();
});

/* Helper functions */

// Calculate how many rows and columns we can nicely fit on screen
function rowsAndCols() {
  return [
    Math.round(window.innerHeight / 150),
    Math.round(window.innerWidth / 200)
  ];
}

// Load board from IndexedDB or create a new one
async function findOrCreateBoard() {
  try {
    const board = Board.fromStorageObject(await database.getItem("autosave"));
    console.info("💾 Loaded board from IndexedDB");
    return board;
  } catch(e) {
    console.info("💾 Started with new board");
    return new Board();
  }
}

// Push a download to the user ("Save as")
function download(filename, contents) {
  if ( !filename || !contents ) return;
  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents);
  anchor.click();
}

// Get an upload from the user ("Open file")
async function upload() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type  = 'file';
    input.addEventListener('change', (c) => {
      if (c.target.files.length != 1) reject("No file selected");
      const reader = new FileReader();
      reader.addEventListener('load', (e) => resolve(e.target.result));
      reader.readAsText(c.target.files[0]);
    });
    input.click();
  });
}

// Where did we click "in the grid"?
function _soundFromEvent(e) {
  const soundElm = e.target.closest('.sound');
  const x = soundElm.getAttribute('data-x');
  const y = soundElm.getAttribute('data-y');
  return [board.getSound(x, y), x, y];
}

function trigger(e, redraw, callback) {
  const [sound] = _soundFromEvent(e);
  if (!sound) return;
  callback(sound);
  if (redraw) boardRenderer.render();
}

function keyTrigger(key, callback) {
  const sound = board.getByKey(key);
  if (!sound) return;
  callback(sound);
}

function setColour(e) {
  const [sound] = _soundFromEvent(e);
  if (!sound) { return; }
  let colourValue;
  if (e.target.classList.contains('save-colour')) {
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
