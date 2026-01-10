import { trackDb } from '../db/trackDb.mjs';
import { getTrackInfoBatch } from '../api/metadata.mjs';

export const trackInfoQueue = new Map();
let trackInfoTimeout = null;
let addInfoToTrackFn = null;

export function setAddInfoToTrack(fn) {
  addInfoToTrackFn = fn;
}

export async function processTrackInfoQueue() {
  if (trackInfoQueue.size === 0) return;

  const ids = Array.from(trackInfoQueue.keys());
  const queueSnapshot = new Map(trackInfoQueue);
  trackInfoQueue.clear();

  const CHUNK_SIZE = 100;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    await getTrackInfoBatch(chunk);
  }

  queueSnapshot.forEach((elements, id) => {
    const info = trackDb[id];
    if (info && addInfoToTrackFn) {
      elements.forEach((track) => {
        if (track && track.isConnected) {
          const isRecommendation = track.closest('[data-testid="recommended-track"]') !== null;
          addInfoToTrackFn(track, isRecommendation);
        }
      });
    }
  });
}

export function queueTrackInfo(id, element) {
  if (!trackInfoQueue.has(id)) {
    trackInfoQueue.set(id, new Set());
  }
  trackInfoQueue.get(id).add(element);

  clearTimeout(trackInfoTimeout);
  trackInfoTimeout = setTimeout(processTrackInfoQueue, 100);
}
