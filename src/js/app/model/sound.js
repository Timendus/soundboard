import PlayMode from './play-mode';

export default class Sound {

  constructor() {
    this._mp3File = null;
    this._colour = this._randomColour();
    this._playMode = PlayMode.Retrigger;
    this._player = new Audio();
    this._playerLoaded = false;
    this._playing = false;
  }

  _loadPlayer() {
    if ( !this._playerLoaded ) {
      this._player.src = this._mp3File.data;
      this._player.load();
      this._player.addEventListener('ended', () => this._stopAnimation());
      requestAnimationFrame(() => this._renderProgress());
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

  _startAnimation() {
    this._playing = true;
  }

  _stopAnimation() {
    this._playing = false;
  }

  _renderProgress() {
    if ( !this._playing )
      return requestAnimationFrame(() => this._renderProgress());

    const progress = document.querySelector(`div.sound[data-x='${this.x}'][data-y='${this.y}'] .progress .bar`);
    const percentage = this._player.currentTime / this._player.duration * 100;
    progress.style.background = `linear-gradient(90deg, white 0%, white ${percentage}%, rgba(255,255,255,0.4) ${percentage}%, rgba(255,255,255,0.4) 100%)`;
    requestAnimationFrame(() => this._renderProgress());
  }

  // Setters

  set mp3File(mp3File) {
    this._mp3File = mp3File || this._mp3File;
    this._playerLoaded = false;
  }

  set colour(colour) {
    this._colour = colour || this._colour;
  }

  set key(key) {
    this._key = key || this._key;
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

  setVolume(volume) {
    this._player.volume = volume;
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

  get key() {
    return this._key;
  }

  // Playback

  push() {
    this._loadPlayer();
    this._player.currentTime = 0;

    switch(this._playMode) {
      case PlayMode.Retrigger:
        this._player.loop = false;
        this._stopAnimation();
        this._startAnimation();
        this._player.play();
        break;
      case PlayMode.OneShot:
        this._player.loop = false;
        if ( this._player.paused ) {
          this._startAnimation();
          this._player.play();
        } else {
          this._stopAnimation();
          this._player.pause();
        }
        break;
      case PlayMode.Gate:
        this._player.loop = true;
        this._startAnimation();
        this._player.play();
        break;
    }
  }

  release() {
    switch(this._playMode) {
      case PlayMode.Gate:
        this._stopAnimation();
        this._player.pause();
        break;
    }
  }

}
