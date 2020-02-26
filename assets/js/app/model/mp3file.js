class Mp3File {

  constructor(file, data) {
    if ( !file.type.match(/audio\/(mp3|mpeg)/) ) {
      throw new Error('Invalid file type');
    }

    this._fileData = data;
    this._tags = {};

    // Parse meta data
    if ( window.jsmediatags ) {
      window.jsmediatags.read(file, {
        onSuccess: this._readTags(this),
        onError: function(error) { throw new Error(error); }
      });
    }
  }

  _readTags(_this) {
    return function(tag) {
      _this._tags = tag.tags;
    }
  }

  // Public methods

  get data() {
    return this._fileData;
  }

  getTag(tag) {
    return this._tags[tag] || "";
  }

}
