import PlayMode from './play-mode';

export default class Sound {

  constructor(mp3File) {
    this._mp3File = mp3File;
    this._colour = this._randomColour();
    this._playMode = PlayMode.Retrigger;
    this._player = new Audio();
    this._playerLoaded = false;
  }

  _loadPlayer() {
    if ( !this._playerLoaded ) {
      this._player.src = this._mp3File.data;
      this._player.load();
      this._playerLoaded = true;
    }
  }

  _randomColour() {
    let colours = [
      '#26748E',
      '#D35528',
      '#934873',
      '#00B9AE',
      '#F9C80E',
      '#48BA66',
      '#FF9C4C'
    ];
    return colours[Math.floor(Math.random() * colours.length)];
  }

  // Setters

  set mp3File(mp3File) {
    this._mp3File = mp3File || this._mp3File;
    this._playerLoaded = false;
  }

  set colour(colour) {
    this._colour = colour || this._colour;
  }

  setPlayModeRetrigger() {
    this._playMode = PlayMode.Retrigger;
  }

  setPlayModeOneShot() {
    this._playMode = PlayMode.OneShot;
  }

  setPlayModeGate() {
    this._playMode = PlayMode.Gate;
  }

  // Getters

  get mp3File() {
    return this._mp3File;
  }

  get colour() {
    return this._colour;
  }

  get playMode() {
    return this._playMode;
  }

  // Playback

  push() {
    this._loadPlayer();
    this._player.currentTime = 0;

    switch(this._playMode) {
      case PlayMode.Retrigger:
        this._player.loop = false;
        this._player.play();
        break;
      case PlayMode.OneShot:
        this._player.loop = false;
        if ( this._player.paused ) {
          this._player.play();
        } else {
          this._player.pause();
        }
        break;
      case PlayMode.Gate:
        this._player.loop = true;
        this._player.play();
        break;
    }
  }

  release() {
    switch(this._playMode) {
      case PlayMode.Gate:
        this._player.pause();
        break;
    }
  }

}
