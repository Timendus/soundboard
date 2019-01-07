class Mp3File {

  constructor(file) {
    if ( !file.type.match(/audio\/(mp3|mpeg)/) ) {
      throw new Error('Invalid file type');
    }

    this._fileData = null;
    this._tags = {};

    // Read in file
    var reader = new FileReader();
    reader.addEventListener('load', this._readData(this));
    reader.readAsDataURL(file);

    // Parse meta data
    if ( window.jsmediatags ) {
      window.jsmediatags.read(file, {
        onSuccess: this._readTags(this),
        onError: function(error) { throw new Error(error); }
      });
    }
  }

  _readData(_this) {
    return function(data) {
      _this._fileData = data.target.result;
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
