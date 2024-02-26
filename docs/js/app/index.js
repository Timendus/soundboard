import Board from "./model/board.js";
import Sound from "./model/sound.js";
import Mp3File from "./model/mp3file.js";
import Midi from "./util/midi.js";
import Keyboard from "./util/keyboard.js";
import BoardRenderer from "./board-renderer.js";
import IndexedDB from "./util/indexedDB.js";
import files from "./util/files.js";
import "./lib/thimbleful.js";
import "./util/pwa.js";

/* Initialize all the bits and pieces */

const database = await IndexedDB.connect("soundboard");
let board = await findOrCreateBoard();
const boardRenderer = new BoardRenderer(document.getElementById("board"));
const clickHandler = Thimbleful.Click.instance();
const dragDrop = Thimbleful.FileTarget.instance();
const midi = new Midi();
const keyboard = new Keyboard();
let volume = 1;

const fileTypes = [
  {
    description: "Soundboard save file",
    accept: {
      "text/plain": [".soundboard"],
    },
  },
];

/* Render the board to the DOM */

board.resizeIfEmpty(...rowsAndCols());
boardRenderer.render(board);

/* Register all event handlers */

// Loading sounds into the soundboard
dragDrop.register(".sound:not(.loaded)", (file, data, e) => {
  const mp3File = new Mp3File(file, data);

  // Find our sound
  const [x, y] = coordinatesFromEvent(e);
  const sound = soundFromEvent(e) || new Sound();

  // Update that position
  sound.mp3File = mp3File;
  sound.setVolume(volume);
  board.placeSound(x, y, sound);

  saveBoard("new sound was added");

  // Rerender the board (I think the timeout had something to do with the drag
  // and drop stuff not removing the hover class otherwise? Not sure anymore.)
  window.setTimeout(() => {
    boardRenderer.render(board);
  }, 10);
});

// Make the soundboard make sounds
clickHandler.register("body:not(.settings) .sound", {
  mousedown: (e) => soundFromEvent(e)?.push(),
  mouseup: (e) => soundFromEvent(e)?.release(),
});
midi.register({
  keyDown: (key) => board.getByKey(key)?.push(),
  keyUp: (key) => board.getByKey(key)?.release(),
});
keyboard.register({
  keyDown: (key) => board.getByKey(key)?.push(),
  keyUp: (key) => board.getByKey(key)?.release(),
});

// Let the volume slider control the volume
document.getElementById("volume").addEventListener("input", (e) => {
  volume = e.target.value;
  board.allSounds().forEach((s) => s.setVolume(volume));
});

// "Navigation" buttons
clickHandler.register("button#clear", () => {
  board.allSounds().forEach((s) => s.destroy());
  board = new Board();
  board.resizeIfEmpty(...rowsAndCols());
  boardRenderer.render(board);
  database.removeItem("autosave");
});
clickHandler.register("button#load", async () => {
  const newBoard = Board.fromStorageObject(
    JSON.parse(
      await files.load({
        types: fileTypes,
        startIn: "music",
      })
    )
  );
  board.allSounds().forEach((s) => s.destroy());
  board = newBoard;
  boardRenderer.render(board);
  document.querySelector("body").classList.remove("settings");
  saveBoard("loaded save file");
});
clickHandler.register("button#save", () => {
  files.save({
    suggestedName: "Untitled.soundboard",
    contents: JSON.stringify(board.toStorageObject()),
    types: fileTypes,
    startIn: "music",
  });
});
clickHandler.register("button#add-row", () => {
  board.addRow();
  boardRenderer.render(board);
});
clickHandler.register("button#add-col", () => {
  board.addColumn();
  boardRenderer.render(board);
});
clickHandler.register("button#settings", () => {
  document.querySelector("body").classList.toggle("settings");
});

// Sound settings
clickHandler.register("button.show-modes", (e) => show(e, ".modes"));
clickHandler.register("button[data-mode=retrigger]", (e) => {
  soundFromEvent(e)?.setPlayModeRetrigger();
  boardRenderer.render(board);
  saveBoard("play mode was changed");
});
clickHandler.register("button[data-mode=oneshot]", (e) => {
  soundFromEvent(e)?.setPlayModeOneShot();
  boardRenderer.render(board);
  saveBoard("play mode was changed");
});
clickHandler.register("button[data-mode=gate]", (e) => {
  soundFromEvent(e)?.setPlayModeGate();
  boardRenderer.render(board);
  saveBoard("play mode was changed");
});

clickHandler.register("button.show-colours", (e) => show(e, ".colours"));
clickHandler.register("button.colour", (e) => {
  soundFromEvent(e).colour = window.getComputedStyle(e.target).getPropertyValue("background-color");
  boardRenderer.render(board);
  saveBoard("colour was changed");
});

clickHandler.register("button.assign-key", (e) => {
  show(e, ".keys");
  Promise.race([keyboard.getNextKeyPress(), midi.getNextKeyPress()])
    .then((key) => {
      soundFromEvent(e).key = key;
    })
    .finally(() => {
      keyboard.cancelGetKeyPress();
      midi.cancelGetKeyPress();
      boardRenderer.render(board);
      saveBoard("key binding was changed");
    });
});

clickHandler.register("button.delete-sound", (e) => {
  board.removeSound(...coordinatesFromEvent(e));
  boardRenderer.render(board);
  saveBoard("sound was removed");
});

// Resize the soundboard when resizing the window
window.addEventListener("resize", () => {
  board.resizeIfEmpty(...rowsAndCols());
  boardRenderer.render(board);
});

/* Helper functions */

// Calculate how many rows and columns we can nicely fit on screen
function rowsAndCols() {
  return [Math.round(window.innerHeight / 150), Math.round(window.innerWidth / 200)];
}

// Load board from IndexedDB or create a new one
async function findOrCreateBoard() {
  try {
    const board = Board.fromStorageObject(await database.getItem("autosave"));
    console.info("💾 Loaded board from IndexedDB");
    return board;
  } catch (e) {
    console.info("💾 Started with new board");
    return new Board();
  }
}

// Store the current soundboard to IndexedDB
async function saveBoard(reason) {
  await database.setItem("autosave", board.toStorageObject());
  console.info("💾 Saved board to IndexedDB because:", reason);
}

// Where did we click "in the grid"?
function coordinatesFromEvent(e) {
  const soundElm = e.target.closest(".sound");
  const x = soundElm.getAttribute("data-x");
  const y = soundElm.getAttribute("data-y");
  return [x, y];
}

// Which sound did we click on?
function soundFromEvent(e) {
  return board.getSound(...coordinatesFromEvent(e));
}

function show(e, className) {
  e.target.closest(".sound").querySelector(className).classList.add("active");
}
