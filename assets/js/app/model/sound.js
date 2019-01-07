class Sound {

  constructor(mp3File) {
    this._mp3File = mp3File;
    this._colour = 'red';
    this._playMode = PlayMode.OneShot;
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

  // Setters

  set mp3File(mp3File) {
    this._mp3File = mp3File || this._mp3File;
    this._playerLoaded = false;
  }

  set colour(colour) {
    this._colour = colour || this._colour;
  }

  setPlayModeOneShot() {
    this._playMode = PlayMode.OneShot;
  }

  setPlayModeStartStop() {
    this._playMode = PlayMode.StartStop;
  }

  setPlayModeHold() {
    this._playMode = PlayMode.Hold;
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
      case PlayMode.OneShot:
        this._player.play();
        break;
      case PlayMode.StartStop:
        if ( this._player.paused ) {
          this._player.play();
        } else {
          this._player.pause();
        }
        break;
      case PlayMode.Hold:
        this._player.loop = true;
        this._player.play();
        break;
    }
  }

  release() {
    switch(this._playMode) {
      case PlayMode.Hold:
        this._player.pause();
        break;
    }
  }

}
