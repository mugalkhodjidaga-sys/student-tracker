const STORAGE_KEY = 'sjm_pending_photo_blobs';

function readMap() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeMap(map) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/** Temporary full-res image storage until Drive upload succeeds (Sheets cells are too small). */
export const pendingBlobStore = {
  set(attachmentId, dataUrl) {
    const map = readMap();
    map[String(attachmentId)] = dataUrl;
    writeMap(map);
  },

  get(attachmentId) {
    return readMap()[String(attachmentId)] || '';
  },

  remove(attachmentId) {
    const map = readMap();
    delete map[String(attachmentId)];
    writeMap(map);
  },

  keys() {
    return Object.keys(readMap());
  },
};
