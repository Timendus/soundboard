class Board {

  constructor() {
    this._rows = 3;
    this._cols = 3;
    this._grid = [];
    this._makeGrid();
  }

  _makeGrid() {
    for(var y = 0; y < this._rows; y++) {
      this._grid[y] = this._grid[y] || [];
      for(var x = 0; x < this._cols; x++) {
        this._grid[y][x] = this._grid[y][x] || null;
      }
    }
  }

  _validateCoords(x, y) {
    if ( x === undefined ||
         y === undefined ||
         x > this._cols  ||
         y > this._rows  ||
         x < 0           ||
         y < 0           ) {
      throw new Error('Out of bounds');
    }
  }

  // Public methods

  get cols() {
    return this._cols;
  }

  get rows() {
    return this._rows;
  }

  addColumn() {
    this._cols += 1;
    this._makeGrid();
  }

  addRow() {
    this._rows += 1;
    this._makeGrid();
  }

  placeSound(x, y, sound) {
    this._validateCoords(x,y);
    this._grid[y][x] = sound;
  }

  getSound(x, y) {
    this._validateCoords(x,y);
    return this._grid[y][x];
  }

}
