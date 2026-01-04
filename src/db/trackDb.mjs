export class DjTrackInfo {
  static fromQueries(res, resTrack) {
    return {
      key: res.key,
      mode: res.mode,
      tempo: Math.round(res.tempo),
      energy: Math.round(100 * res.energy),
      danceability: Math.round(100 * res.danceability),
      popularity: resTrack.popularity,
      release_date: resTrack.release_date.split("-")[0],
    };
  }
}

export const trackDb = {}; // In-memory cache

export const idb = {
  db: null,
  initPromise: null,
  init: () => {
    if (idb.initPromise) return idb.initPromise;
    idb.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open("dj-info-idb", 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("tracks")) {
          db.createObjectStore("tracks", { keyPath: "id" });
        }
      };
      request.onsuccess = (event) => {
        idb.db = event.target.result;
        resolve();
      };
      request.onerror = (event) => {
        console.error("DJ Info: IndexedDB error", event);
        reject(event);
      };
    });
    return idb.initPromise;
  },
  get: async (id) => {
    if (!idb.db) await idb.init();
    return new Promise((resolve) => {
      const transaction = idb.db.transaction(["tracks"], "readonly");
      const store = transaction.objectStore("tracks");
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result?.val || null);
      request.onerror = () => resolve(null);
    });
  },
  getMany: async (ids) => {
    // Helper to get multiple items
    if (!idb.db) await idb.init();
    return new Promise((resolve) => {
      const transaction = idb.db.transaction(["tracks"], "readonly");
      const store = transaction.objectStore("tracks");
      const results = [];
      let completed = 0;

      if (ids.length === 0) return resolve([]);

      ids.forEach((id) => {
        const request = store.get(id);
        request.onsuccess = () => {
          if (request.result?.val)
            results.push({ id, val: request.result.val });
          completed++;
          if (completed === ids.length) resolve(results);
        };
        request.onerror = () => {
          completed++;
          if (completed === ids.length) resolve(results);
        };
      });
    });
  },
  setMany: async (items) => {
    // items: [{id, val}]
    if (!idb.db) await idb.init();
    return new Promise((resolve) => {
      const transaction = idb.db.transaction(["tracks"], "readwrite");
      const store = transaction.objectStore("tracks");
      items.forEach((item) => store.put({ id: item.id, val: item.val }));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  },
};

// Migration from LocalStorage to IndexedDB
async function migrateLocalStorage() {
  const LS_KEY = "dj-info-tracks";
  const rawData = Spicetify.LocalStorage.get(LS_KEY);
  if (!rawData) return;

  console.log("DJ Info: Migrating LocalStorage to IndexedDB...");
  try {
    const oldDb = JSON.parse(rawData);
    const itemsToStore = [];

    // Helper to parse old CSV format
    const fromOldFormat = (obj) => {
      if (typeof obj === "string") {
        const [
          key,
          mode,
          tempo,
          energy,
          danceability,
          popularity,
          release_date,
        ] = obj.split(",").map((x) => (x === "" ? null : +x));
        return {
          key,
          mode,
          tempo,
          energy,
          danceability,
          popularity,
          release_date,
        };
      }
      return obj;
    };

    Object.keys(oldDb).forEach((id) => {
      const val = fromOldFormat(oldDb[id]);
      if (val) itemsToStore.push({ id, val });
    });

    if (itemsToStore.length > 0) {
      await idb.setMany(itemsToStore);
      console.log(`DJ Info: Migrated ${itemsToStore.length} tracks.`);
    }

    Spicetify.LocalStorage.remove(LS_KEY);
    console.log("DJ Info: LocalStorage cleaned.");
  } catch (e) {
    console.error("DJ Info: Migration failed", e);
  }
}

export function cleanupOldStorage() {
  const keysToRemove = [];
  for (let i = 0; i < Spicetify.LocalStorage.length; i++) {
    const key = Spicetify.LocalStorage.key(i);
    if (
      key.startsWith("djinfo-") &&
      key !== "dj-info-tracks" &&
      key !== "dj-info-config"
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => Spicetify.LocalStorage.remove(key));
  if (keysToRemove.length > 0) {
    console.log("DJ Info: Cleaned up old/legacy keys.");
  }
}

export function initTrackDb() {
  idb.init().then(migrateLocalStorage);
  cleanupOldStorage();
}
