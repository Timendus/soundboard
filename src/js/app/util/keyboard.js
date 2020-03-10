export default class Keyboard {

  constructor() {
    window.addEventListener('keydown', e => !e.repeat && this._keyDownHandler(e.key));
    window.addEventListener('keyup',   e => !e.repeat && this._keyUpHandler(e.key));
  }

  register({ keyDown, keyUp }) {
    this._keyDown = keyDown;
    this._keyUp   = keyUp;
  }

  getNextKeyPress() {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._timeout = setTimeout(() => reject("Waiting too long for a key press"), 5000);
    });
  }

  cancelGetKeyPress() {
    clearTimeout(this._timeout);
    this._resolve = null;
  }

  _keyDownHandler(key) {
    if ( this._resolve ) {
      this._resolve(key);
      return this.cancelGetKeyPress();
    }

    if ( this._keyDown ) this._keyDown(key);
  }

  _keyUpHandler(key) {
    if ( this._keyUp ) this._keyUp(key);
  }

}
