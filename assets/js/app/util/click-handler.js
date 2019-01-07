/**
 * Okay, so why do we need this? Why a whole class to implement our own version
 * of click handling? Am I insane?
 *
 * Well, maybe, but not because of this.
 *
 * This class installs one single click handler on the whole document, and
 * evaluates which callback to call at click time, based on the element that has
 * been clicked. This allows us to swap out and rerender whole sections of the
 * DOM without having to reinstall a bunch of click handlers each time. This
 * nicely decouples the render logic from the click event management logic.
 */

class ClickHandler {

  constructor() {
    this._handlers = {};
    document.addEventListener('click',     (e) => this._callHandler('click',     e));
    document.addEventListener('mousedown', (e) => this._callHandler('mousedown', e));
    document.addEventListener('mouseup',   (e) => this._callHandler('mouseup',   e));
  }

  register(selector, handlers = {click: null, mousedown: null, mouseup: null}) {
    this._handlers[selector] = handlers;
  }

  _callHandler(type, e) {
    Object.keys(this._handlers).forEach((selector) => {
      if (e.target.matches(selector)) {
        let handler = this._handlers[selector][type];
        if ( handler ) { handler(e); }
      }
    });
  }

}
