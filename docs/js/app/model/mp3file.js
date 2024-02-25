// import * as mm from '../lib/music-metadata-browser-2.5.10.js';

export default class Mp3File {

  constructor(file, data) {
    if ( !file.type.match(/^audio/) ) {
      throw new Error('Invalid file type');
    }

    this._file = file;
    this._fileData = data;
    this._tags = {};

    // Parse meta data
    // mm.parseBlob(file).then(metadata => {
    //   this._tags = metadata.common;
    // });
  }

  // Public methods

  get data() {
    return this._fileData;
  }

  getTag(tag) {
    if ( tag === 'title' )
      return this._tags[tag] || this._file.name;

    return this._tags[tag] || "";
  }

}
