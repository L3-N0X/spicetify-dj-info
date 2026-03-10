import {
  extendedMetadataJsonDescriptor,
  trackMetadataJsonDescriptor,
} from '../constants/protobuf.mjs';
import { trackDb, idb, DjTrackInfo } from '../db/trackDb.mjs';

let extendedMetadataRequest = null;
let trackMetadataResponse = null;

function getProtobufTypes() {
  if (!extendedMetadataRequest) {
    extendedMetadataRequest = globalThis.protobuf.Root.fromJSON(
      extendedMetadataJsonDescriptor,
    ).lookup('Message');
    trackMetadataResponse = globalThis.protobuf.Root.fromJSON(trackMetadataJsonDescriptor).lookup(
      'Message',
    );
  }
  return {
    extendedMetadataRequest,
    trackMetadataResponse,
  };
}

let country = 'US';
let catalogue = 'premium';

export async function initProductState() {
  const productStateValues = await Spicetify.Platform.ProductStateAPI.getValues();
  country = productStateValues['country'] ?? 'US';
  catalogue = productStateValues['catalogue'] ?? 'premium';
}

export async function getExtendedMetadata(entity_uris, extension_kind) {
  const { extendedMetadataRequest } = getProtobufTypes();
  const task_id = new Uint8Array(16);
  crypto.getRandomValues(task_id);

  const payload = extendedMetadataRequest
    .encode({
      header: { country, catalogue, task_id },
      request: entity_uris.map((entity_uri) => ({
        entity_uri,
        query: { extension_kind },
      })),
    })
    .finish();

  const resp = await fetch(
    'https://spclient.wg.spotify.com/extended-metadata/v0/extended-metadata',
    {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/protobuf',
        Authorization: `Bearer ${Spicetify.Platform.AuthorizationAPI.getState().token.accessToken}`,
        'Spotify-App-Version': Spicetify.Platform.version,
        'App-Platform': Spicetify.Platform.PlatformData.app_platform,
      },
      timeout: 1000 * 15,
    },
  );

  return new Uint8Array(await resp.arrayBuffer());
}

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export async function getFeatures(ids) {
  const chunks = chunkArray(ids, 100);
  const allFeatures = [];

  for (const chunk of chunks) {
    const idsString = chunk.join(',');
    try {
      const response = await Spicetify.CosmosAsync.get(
        `https://spclient.wg.spotify.com/audio-attributes/v1/audio-features?ids=${idsString}`,
      );

      if (response && response.audio_features) {
        allFeatures.push(...response.audio_features);
      }
    } catch (error) {
      console.error('DJ Info: Error fetching audio features:', error);
    }
  }

  return allFeatures.map((features) => {
    if (!features) return null;

    return {
      id: features.id,
      tempo: features.tempo,
      key: features.key,
      mode: features.mode,
      danceability: features.danceability,
      energy: features.energy,
      acousticness: features.acousticness,
      instrumentalness: features.instrumentalness,
      liveness: features.liveness,
      loudness: features.loudness,
      speechiness: features.speechiness,
      valence: features.valence,
      time_signature: features.time_signature,
    };
  });
}

export async function getTrackFeatures(ids) {
  const { trackMetadataResponse } = getProtobufTypes();
  const buf = await getExtendedMetadata(
    ids.map((id) => `spotify:track:${id}`),
    10,
  );
  const msg = trackMetadataResponse.decode(buf);

  return msg.response.map((resp) => {
    if (!resp.metadata) return null;
    const metadata = resp.metadata.metadata;
    const date = metadata.album.release_date;
    const date_iso = `${date?.year}-${(date?.month + '').padStart(2, '0')}-${(date?.day + '').padStart(2, '0')}`;
    return {
      id: resp.track.split(':')[2],
      popularity: metadata.popularity,
      release_date: date_iso,
    };
  });
}

export async function getTrackInfo(id) {
  // Check in-memory cache first
  if (trackDb[id]) {
    return trackDb[id];
  }

  // Check IndexedDB
  const fromIdb = await idb.get(id);
  if (fromIdb) {
    trackDb[id] = fromIdb;
    return fromIdb;
  }

  const [info] = await getTrackInfoBatch([id]);
  return info;
}

function isInfoComplete(info) {
  return (
    info &&
    info.acousticness !== undefined &&
    info.acousticness !== null &&
    !isNaN(info.acousticness)
  );
}

export async function getTrackInfoBatch(ids) {
  // 1. Identify what is MISSING or INCOMPLETE in Memory
  const needsRefetch = ids.filter((id) => !trackDb[id] || !isInfoComplete(trackDb[id]));

  // 2. Try to fetch from IDB for those we don't have complete in Memory
  if (needsRefetch.length > 0) {
    const fromIdb = await idb.getMany(needsRefetch);
    fromIdb.forEach((item) => {
      // Only use IDB value if it's complete or if we don't have anything in memory
      if (isInfoComplete(item.val) || !trackDb[item.id]) {
        trackDb[item.id] = item.val;
      }
    });
  }

  // 3. Identify what is STILL missing or incomplete after checking IDB
  const idsToFetch = ids.filter((id) => !trackDb[id] || !isInfoComplete(trackDb[id]));

  // 4. Fetch from Network
  if (idsToFetch.length > 0) {
    try {
      const results = await Promise.allSettled([
        getFeatures(idsToFetch),
        getTrackFeatures(idsToFetch),
      ]);

      const featuresRes = results[0].status === 'fulfilled' ? results[0].value : null;
      const metadataRes = results[1].status === 'fulfilled' ? results[1].value : null;

      if (featuresRes) {
        const newItems = [];

        featuresRes.forEach((track) => {
          if (track) {
            const trackDetails = metadataRes?.find((t) => t?.id === track?.id);
            if (trackDetails) {
              const info = DjTrackInfo.fromQueries(track, trackDetails);
              trackDb[track.id] = info;
              newItems.push({ id: track.id, val: info });
            }
          }
        });

        // Save new items to IDB
        if (newItems.length > 0) {
          await idb.setMany(newItems);
        }
      }
    } catch (error) {
      console.error('DJ Info: Error fetching batch track info:', error);
    }
  }

  return ids.map((id) => {
    if (trackDb[id]) return trackDb[id];
    return null;
  });
}
