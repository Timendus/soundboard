import "../lib/jsmediatags-3.9.7.js";

export default class Mp3File {
  constructor(file, data) {
    if (!file.type.match(/^audio/)) {
      throw new Error("Invalid file type");
    }

    this._file = file;
    this._fileData = data;
    this._tags = {};

    // Parse meta data
    jsmediatags.read(file, {
      onSuccess: (tags) => (this._tags = tags?.tags),
      onError: (error) => {
        console.info(`Could not read metadata for file ${file.name}, because:`, error);
      },
    });
  }

  // Public methods

  get data() {
    return this._fileData;
  }

  getTag(tag) {
    if (tag === "title") return this._tags[tag] || this._file.name;
    return this._tags[tag] || "";
  }

  // Saving and loading

  toStorageObject() {
    return {
      file: {
        name: this._file.name,
        type: this._file.type,
      },
      data: this._fileData,
    };
  }

  static fromStorageObject(obj) {
    const blob = createBlob(obj.data);
    const file = new File([blob], obj.file.name, {
      type: obj.file.type,
    });
    return new Mp3File(file, obj.data);
  }
}

function createBlob(base64, sliceSize = 512) {
  const [meta, data] = base64.split(",");
  const contentType = meta.split(":")[1].split(";")[0];

  const byteCharacters = atob(data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
