import PlayMode from "./model/play-mode.js";

export default class BoardRenderer {
  constructor(element) {
    this._element = element;
  }

  render(board) {
    let html = "";
    for (let y = 0; y < board.rows; y++) {
      html += `<div class='row'>`;
      for (let x = 0; x < board.cols; x++) {
        let sound = board.getSound(x, y);
        let title, artist, colour, playMode;

        if (sound) {
          title = sound.mp3File.getTag("title") || "Unknown song";
          artist = sound.mp3File.getTag("artist");
          colour = sound.colour;
          playMode = sound.playMode;
        } else {
          title = "Click or drop<br/><br/>an mp3 file here";
          artist = "";
          colour = "#615a5a";
          playMode = PlayMode.Disabled;
        }

        html += `
          <div class='sound ${sound ? "loaded" : ""}'
               data-x='${x}' data-y='${y}'
               style='background-color: ${colour}'>
            ${
              sound
                ? `
              <div class='progress'><div class='bar'></div></div>
              <div class='settings'>
                <button class='show-modes ${
                  playMode == PlayMode.Retrigger
                    ? "retrigger"
                    : playMode == PlayMode.OneShot
                      ? "oneshot"
                      : playMode == PlayMode.Gate
                        ? "gate"
                        : ""
                } active'></button>
                <div class='modes'>
                  <button data-mode='retrigger' class='retrigger ${playMode == PlayMode.Retrigger ? "active" : ""}'></button>
                  <button data-mode='oneshot'   class='oneshot   ${playMode == PlayMode.OneShot ? "active" : ""}'></button>
                  <button data-mode='gate'      class='gate      ${playMode == PlayMode.Gate ? "active" : ""}'></button>
                </div>
                <button class='show-colours'></button>
                <div class='colours'>
                  <button class='colour blue'></button>
                  <button class='colour red'></button>
                  <button class='colour purple'></button>
                  <button class='colour cyan'></button>
                  <button class='colour yellow'></button>
                  <button class='colour green'></button>
                  <button class='colour orange'></button>
                  <!--<input type="text" length="10" value="${colour}"/><button class='save-colour'>Save</button>-->
                </div>
                <button class='assign-key ${sound.key ? "assigned" : ""}'>${sound.key ? sound.key : ""}</button>
                <div class='keys'>
                  Press a key...
                </div>
                <button class='delete-sound' title='Clear this sound'>🗑️</button>
              </div>
            `
                : ""
            }
            <div class='props'>
              <h1>${title}</h1>
              ${
                sound
                  ? `
                <p>${artist}</p>
              `
                  : ""
              }
            </div>
          </div>
        `;
      }
      html += `</div>`;
    }
    this._element.innerHTML = html;
  }
}
