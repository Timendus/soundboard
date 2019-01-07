/**
 * Fancy thing for file drag an drop, kinda similar to click-handler.js
 */

class DragDrop {

  constructor() {
    this._handlers = {};
    document.addEventListener('dragover',  (e) => this._dragOver(e));
    document.addEventListener('dragleave', (e) => this._dragLeave(e));
    document.addEventListener('drop',      (e) => this._drop(e));
  }

  register(selector, callback) {
    this._handlers[selector] = callback;
  }

  _dragOver(e) {
    e.stopPropagation();
  	e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.target.classList.add('dragging');
  }

  _dragLeave(e) {
    e.stopPropagation();
  	e.preventDefault();
    e.target.classList.remove('dragging');
  }

  _drop(e) {
    e.stopPropagation();
  	e.preventDefault();
    e.target.classList.remove('dragging');

    Object.keys(this._handlers).forEach((selector) => {
      if (e.target.matches(selector)) {
        this._handlers[selector](e);
      }
    });
  }

}
