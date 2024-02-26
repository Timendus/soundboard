/**
 * Abstraction around IndexedDB storage to provide the same simple interface as
 * localStorage. Because I'm lazy and I don't want to deal with real database
 * magic. It will create a database with a single table. Both the database and
 * the table will have the name you pass to `connect`. The key-value pairs will
 * be stored in that table.
 *
 * Main differences with the localStorage API: this is async and it can store
 * complicated objects, not just strings.
 *
 * Usage:
 *
 * ```javascript
 *   import IndexedDB from 'indexedDB.js';
 *   const db = await IndexedDB.connect("my-database");
 *   await db.setItem('some key', 'some value');
 *   console.log(await db.getItem('some key'));
 *   await db.removeItem('some key');
 * ```
 */

export default class IndexedDB {

  constructor(db, name) {
    this._db = db;
    this._name = name;
  }

  static async connect(name) {
    return new Promise((resolve, reject) => {
      const dbOpenRequest = indexedDB.open(name, 4);
      dbOpenRequest.addEventListener('error', reject);
      dbOpenRequest.addEventListener('upgradeneeded', (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore(name, { keyPath: 'key' });
      });
      dbOpenRequest.addEventListener('success', (event) => {
        resolve(new IndexedDB(dbOpenRequest.result, name));
      });
    });
  }

  async setItem(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(this._name, 'readwrite');
      transaction.addEventListener('complete', () => resolve());
      transaction.addEventListener('error', reject);
      const objectStore = transaction.objectStore(this._name);
      const objectStoreRequest = objectStore.get(key);
      objectStoreRequest.addEventListener('error', reject);
      objectStoreRequest.addEventListener('success', () => {
        const data = objectStoreRequest.result;
        if (data) {
          data.value = value;
          const updateValueRequest = objectStore.put(data);
          updateValueRequest.addEventListener('error', reject);
          updateValueRequest.addEventListener('success', () => resolve());
        } else {
          objectStore.add({ key, value });
          resolve();
        }
      });
    });
  }

  async getItem(key) {
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(this._name, 'readonly');
      transaction.addEventListener('error', reject);
      const objectStore = transaction.objectStore(this._name);
      const objectStoreRequest = objectStore.get(key);
      objectStoreRequest.addEventListener('error', reject);
      objectStoreRequest.addEventListener('success', () => {
        resolve(objectStoreRequest.result?.value);
      });
    });
  }

  async removeItem(key) {
    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(this._name, 'readwrite');
      transaction.addEventListener('complete', () => resolve());
      transaction.addEventListener('error', reject);
      transaction.objectStore(this._name).delete(key);
    });
  }

}
