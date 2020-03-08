export default class Midi {

  constructor() {
    if ( !navigator.requestMIDIAccess )
      return console.log("🎹 MIDI not available");

    navigator.requestMIDIAccess()
      .then(access => {
        access.inputs.forEach(input => this._connectDevice(input));

        access.addEventListener('statechange', e => {
          console.log(e);
          // Print information about the (dis)connected MIDI controller
          console.log(e.port.name, e.port.manufacturer, e.port.state);

          // if ( new device ) this._connectDevice(device)
        });

        if ( access.inputs.size === 0 )
          console.log("🎹 No MIDI devices found");
      })
      .catch(failure => {
        console.log("🎹 Can't initialize MIDI", failure);
      });
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

  _connectDevice(device) {
    console.log("🎹 Connecting device", device);
    device.addEventListener('midimessage', midiEvent => {
      const command = midiEvent.data[0];
      const note = midiEvent.data[1];
      const velocity = (midiEvent.data.length > 2) ? midiEvent.data[2] : 0;

      if ( command === 144 && velocity > 0 )
        this._keyDownHandler(note);
      if ( command === 144 && velocity < 0 || command === 128 )
        this._keyUpHandler(note);
    })
  }

  _keyDownHandler(note) {
    if ( this._resolve ) {
      clearTimeout(this._timeout);
      this._resolve(note);
      return;
    }

    if ( this._keyDown ) this._keyDown(note);
  }

  _keyUpHandler(note) {
    if ( this._keyUp ) this._keyUp(note);
  }

}
