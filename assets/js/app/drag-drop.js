/**
 * Fancy thing for file drag an drop, kinda similar to click-handler.js
 */

class DragDrop {

  register(selector, callback) {
    var elements = document.querySelectorAll(selector);

    for(var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('dragover', this._dragOver);
      elements[i].addEventListener('dragleave', this._dragLeave);
      elements[i].addEventListener('drop', this._drop(callback));
    }
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

  _drop(callback) {
    return function(e) {
      e.stopPropagation();
    	e.preventDefault();
      e.target.classList.remove('dragging');
      callback(e);
    }
  }

}
