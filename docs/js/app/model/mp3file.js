import '../lib/jsmediatags-3.9.7.js';

export default class Mp3File {

  constructor(file, data) {
    if (!file.type.match(/^audio/)) {
      throw new Error('Invalid file type');
    }

    this._file = file;
    this._fileData = data;
    this._tags = {};

    // Parse meta data
    jsmediatags.read(file, {
      onSuccess: (tags) => this._tags = tags?.tags,
      onError: (error) => { throw error; }
    });
  }

  // Public methods

  get data() {
    return this._fileData;
  }

  getTag(tag) {
    if (tag === 'title')
      return this._tags[tag] || this._file.name;

    return this._tags[tag] || "";
  }

}
