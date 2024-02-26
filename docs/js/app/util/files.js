/**
 * Abstract away loading and saving of text files in the browser. The given save
 * and load options are "best effort". If the new File System Access API is not
 * available in the browser, it will still work, but basically ignore all your
 * preferences.
 *
 * Usage:
 *
 * ```javascript
 *   import files from "files.js";
 *
 *   await files.save({
 *     suggestedName: "Untitled.extension",
 *     contents: "I'm in your files",
 *     startIn: "documents",
 *     types: [{
 *       description: 'My very special file type',
 *       accept: {
 *         'text/plain': ['.extension'],
 *       },
 *     }],
 *   });
 *
 *   await files.load({
 *     startIn: "documents",
 *     types: [{
 *       description: 'My very special file type',
 *       accept: {
 *         'text/plain': ['.extension'],
 *       },
 *     }],
 *   });
 * ```
 */

/**
 * See types here:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker
 * @typedef {Object} FileTypes
 * @property {string} description What these files are known as
 * @property {Object} accept The accepted files types and associated extensions
 */

/**
 * @typedef {Object} SaveOptions
 * @property {string} suggestedName The name to save the file as
 * @property {string} contents What should be stored in the file
 * @property {FileTypes[]} types Which file types are supported
 * @property {("desktop"|"document"|"downloads"|"music"|"pictures"|"videos")}
 * startIn Where the file picker opens
 */

/**
 * @typedef {Object} LoadOptions
 * @property {FileTypes[]} types Which file types are supported
 * @property {("desktop"|"document"|"downloads"|"music"|"pictures"|"videos")}
 * startIn Where the file picker opens
 */

/**
 * Push a download to the user ("Save as")
 * @param {SaveOptions} options What to store, and where
 */
export async function save(options) {
  if (!options.suggestedName || !options.contents) return;

  if ("showSaveFilePicker" in window) {
    const fileHandle = await window.showSaveFilePicker(options);
    const writable = await fileHandle.createWritable();
    await writable.write(options.contents);
    await writable.close();
    return;
  }

  // Fallback behaviour for browser that don't support the fancy new File System
  // Access API
  const anchor = document.createElement("a");
  anchor.download = options.suggestedName;
  anchor.href = "data:text/plain;charset=utf-8," + encodeURIComponent(options.contents);
  anchor.click();
}

/**
 * Get an upload from the user ("Open file")
 * @param {LoadOptions} options What to open, and from where
 * @returns {string} The contents of the opened file
 */
export async function load(options) {
  if ("showOpenFilePicker" in window) {
    const [fileHandle] = await window.showOpenFilePicker(options);
    const file = await fileHandle.getFile();
    return await file.text();
  }

  // Fallback behaviour for browser that don't support the fancy new File System
  // Access API
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", (c) => {
      if (c.target.files.length != 1) reject("No file selected");
      const reader = new FileReader();
      reader.addEventListener("load", (e) => resolve(e.target.result));
      reader.readAsText(c.target.files[0]);
    });
    input.click();
  });
}

export default { save, load };
