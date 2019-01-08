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
        let title, artist, colour, playMode;
        if ( sound ) {
          title    = sound.mp3File.getTag('title') || 'Unknown song';
          artist   = sound.mp3File.getTag('artist');
          colour   = sound.colour;
          playMode = sound.playMode;
        } else {
          title    = 'Drop an mp3 file here';
          artist   = '';
          colour   = 'gray';
          playMode = PlayMode.Disabled;
        }
        html += `
          <div class='sound ${sound ? 'loaded' : ''}'
               data-x='${x}' data-y='${y}'
               style='background-color: ${colour}'>
            <h1>${title}</h1>
            <p>${artist}</p>
            ${sound ? `
              <button class='one-shot   ${playMode == PlayMode.OneShot   ? 'active' : ''}'></button>
              <button class='start-stop ${playMode == PlayMode.StartStop ? 'active' : ''}'></button>
              <button class='hold       ${playMode == PlayMode.Hold      ? 'active' : ''}'></button>
              <input type="text" length="10" value="${colour}"/><button class='save-colour'>Save</button>
            ` : ''}
          </div>
        `;
      }
      html += `</div>`;
    }
    this._element.innerHTML = html;
  }

}
