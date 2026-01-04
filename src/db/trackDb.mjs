export class DjTrackInfo {
  static fromQueries(res, resTrack) {
    return {
      key: res.key,
      mode: res.mode,
      tempo: Math.round(res.tempo),
      energy: Math.round(100 * res.energy),
      danceability: Math.round(100 * res.danceability),
      popularity: resTrack.popularity,
      release_date: resTrack.release_date.split("-")[0]
    };
  }

  static from(obj) {
    if (typeof obj === "string") {
      const [key, mode, tempo, energy, danceability, popularity, release_date] = obj.split(",").map(x => (
        x === "" ? null : +x
      ));
      obj = { key, mode, tempo, energy, danceability, popularity, release_date };
    }
    return obj;
  }

  static tostr(obj) {
    const { key, mode, tempo, energy, danceability, popularity, release_date } = obj;
    return [key, mode, tempo, energy, danceability, popularity, release_date].map(x => (
      x !== x ? null : x // NaN check
    )).join();
  }
}

export let trackDb = {};

export function loadTrackDb() {
  try {
    trackDb = JSON.parse(Spicetify.LocalStorage.get("dj-info-tracks") || "{}");
    Object.keys(trackDb).forEach(key => {
      trackDb[key] = DjTrackInfo.from(trackDb[key]);
    });
  } catch {
    trackDb = {};
  }
}

let saveTimeout = null;

export function saveTrackDb(immediate = false) {
  const doSave = () => {
    const savedDb = {};
    Object.keys(trackDb).forEach(key => {
      savedDb[key] = DjTrackInfo.tostr(trackDb[key]);
    });
    Spicetify.LocalStorage.set("dj-info-tracks", JSON.stringify(savedDb));
    saveTimeout = null;
  };

  if (immediate) {
    clearTimeout(saveTimeout);
    doSave();
    return;
  }

  if (!saveTimeout) {
    saveTimeout = setTimeout(doSave, 200);
  }
}

export function cleanupOldStorage() {
  const keysToRemove = [];
  for (let i = 0; i < Spicetify.LocalStorage.length; i++) {
    const key = Spicetify.LocalStorage.key(i);
    if (key.startsWith("djinfo-") && key !== "dj-info-tracks" && key !== "dj-info-config") {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => Spicetify.LocalStorage.remove(key));
  if (keysToRemove.length > 0) {
    Spicetify.showNotification("Cleaned up old DJ Info tracks from local storage.");
  }
}

export function initTrackDb() {
  loadTrackDb();
  cleanupOldStorage();
  window.addEventListener("beforeunload", () => saveTrackDb(true));
}