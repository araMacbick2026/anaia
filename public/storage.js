const request = req => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error('Local storage did not respond.')), 3000);
  req.onsuccess = () => { clearTimeout(timer); resolve(req.result); };
  req.onerror = () => { clearTimeout(timer); reject(req.error); };
});
let database, opening;
export async function openDB() {
  if (database) return database;
  if (opening) return opening;
  opening = new Promise((resolve, reject) => {
    const req = indexedDB.open('anaia-local', 1);
    let finished = false;
    const fail = error => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      reject(error);
    };
    const timer = setTimeout(() => fail(Error('Local storage did not open.')), 3000);
    req.onupgradeneeded = () => {
      if (finished) { req.transaction.abort(); return; }
      req.result.createObjectStore('records');
    };
    req.onblocked = () => fail(Error('Local storage is blocked by another ANAIA tab.'));
    req.onerror = () => fail(req.error);
    req.onsuccess = () => {
      if (finished) { req.result.close(); return; }
      finished = true;
      clearTimeout(timer);
      database = req.result;
      database.onversionchange = () => { database.close(); database = undefined; };
      resolve(database);
    };
  });
  try { return await opening; } finally { opening = undefined; }
}
export async function read(key, fallback) {
  const db = await openDB();
  return (await request(db.transaction('records').objectStore('records').get(key))) ?? fallback;
}
export async function write(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    tx.objectStore('records').put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
export async function erase() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    tx.objectStore('records').clear();
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
// Delete one profile's records without touching any other profile.
export async function removeKeys(keys, updates = {}) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    keys.forEach(key => tx.objectStore('records').delete(key));
    Object.entries(updates).forEach(([key,value])=>tx.objectStore('records').put(value,key));
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
