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
    document.addEventListener('click', (e) => this._handleClick(e));
    this._handlers = {};
  }

  register(selector, callback) {
    this._handlers[selector] = callback;
  }

  _handleClick(e) {
    Object.keys(this._handlers).forEach((selector) => {
      if (e.target.matches(selector)) {
        this._handlers[selector](e);
      }
    });
  }

}
