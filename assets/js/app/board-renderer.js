class BoardRenderer {

  constructor(element, board) {
    this._element = element;
    this._board = board;
  }

  render() {
    let html = '';
    for ( let y = 0; y < this._board.rows; y++ ) {
      html += `<div class='row'>`;
      for ( let x = 0; x < this._board.cols; x++ ) {
        let sound  = this._board.getSound(x,y);
        let title, artist, colour;
        if ( sound ) {
          title  = sound.mp3File.getTag('title') || 'Unknown song';
          artist = sound.mp3File.getTag('artist');
          colour = sound.colour;
        } else {
          title  = 'Drop an mp3 file here';
          artist = '';
          colour = 'gray';
        }
        html += `
          <div class='sound ${sound ? 'loaded' : ''}'
               data-x='${x}' data-y='${y}'
               style='background-color: ${colour}'>
            <h1>${title}</h1>
            <p>${artist}</p>
          </div>
        `;
      }
      html += `</div>`;
    }
    this._element.innerHTML = html;
  }

}
