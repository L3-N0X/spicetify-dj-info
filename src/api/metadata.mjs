import {
  extendedMetadataJsonDescriptor,
  audioFeaturesJsonDescriptor,
  trackMetadataJsonDescriptor,
} from "../constants/protobuf.mjs";
import { trackDb, saveTrackDb, DjTrackInfo } from "../db/trackDb.mjs";

let extendedMetadataRequest = null;
let audioFeaturesResponse = null;
let trackMetadataResponse = null;

function getProtobufTypes() {
  if (!extendedMetadataRequest) {
    extendedMetadataRequest = globalThis.protobuf.Root.fromJSON(extendedMetadataJsonDescriptor).lookup("Message");
    audioFeaturesResponse = globalThis.protobuf.Root.fromJSON(audioFeaturesJsonDescriptor).lookup("Message");
    trackMetadataResponse = globalThis.protobuf.Root.fromJSON(trackMetadataJsonDescriptor).lookup("Message");
  }
  return { extendedMetadataRequest, audioFeaturesResponse, trackMetadataResponse };
}

let country = "US";
let catalogue = "premium";

export async function initProductState() {
  const productStateValues = await Spicetify.Platform.ProductStateAPI.getValues();
  country = productStateValues["country"] ?? "US";
  catalogue = productStateValues["catalogue"] ?? "premium";
}

export async function getExtendedMetadata(entity_uris, extension_kind) {
  const { extendedMetadataRequest } = getProtobufTypes();
  const task_id = new Uint8Array(16);
  crypto.getRandomValues(task_id);
  
  const payload = extendedMetadataRequest.encode({
    header: { country, catalogue, task_id },
    request: entity_uris.map((entity_uri) => (
      { entity_uri, query: { extension_kind } }
    ))
  }).finish();

  const resp = await fetch("https://spclient.wg.spotify.com/extended-metadata/v0/extended-metadata", {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/protobuf",
      "Authorization": `Bearer ${Spicetify.Platform.AuthorizationAPI.getState().token.accessToken}`,
      "Spotify-App-Version": Spicetify.Platform.version,
      "App-Platform": Spicetify.Platform.PlatformData.app_platform,
    },
    timeout: 1000 * 15
  });

  return new Uint8Array(await resp.arrayBuffer());
}

export async function getFeatures(ids) {
  const { audioFeaturesResponse } = getProtobufTypes();
  const buf = await getExtendedMetadata(ids.map((id) => `spotify:track:${id}`), 222);
  const msg = audioFeaturesResponse.decode(buf);

  return msg.response.map((resp) => {
    if (!resp.attributes) return null;
    const attributes = resp.attributes.attributes;
    return {
      id: resp.track.split(":")[2],
      tempo: attributes.bpm,
      key: "C C# D D# E F F# G G# A A# B".split(" ").indexOf(attributes.key.key),
      mode: attributes.key.majorMinor - 1
    };
  });
}

export async function getTrackFeatures(ids) {
  const { trackMetadataResponse } = getProtobufTypes();
  const buf = await getExtendedMetadata(ids.map((id) => `spotify:track:${id}`), 10);
  const msg = trackMetadataResponse.decode(buf);

  return msg.response.map((resp) => {
    if (!resp.metadata) return null;
    const metadata = resp.metadata.metadata;
    const date = metadata.album.release_date;
    const date_iso = `${date?.year}-${(date?.month + '').padStart(2, '0')}-${(date?.day + '').padStart(2, '0')}`;
    return {
      id: resp.track.split(":")[2],
      popularity: metadata.popularity,
      release_date: date_iso
    };
  });
}

export async function getTrackInfo(id) {
  if (trackDb[id]) {
    return trackDb[id];
  }
  const [info] = await getTrackInfoBatch([id]);
  return info;
}

export async function getTrackInfoBatch(ids) {
  const idsToFetch = ids.filter((id) => !trackDb[id]);

  if (idsToFetch.length > 0) {
    try {
      const results = await Promise.allSettled([
        getFeatures(idsToFetch),
        getTrackFeatures(idsToFetch),
      ]);

      const featuresRes = results[0].status === "fulfilled" ? results[0].value : null;
      const metadataRes = results[1].status === "fulfilled" ? results[1].value : null;

      if (featuresRes) {
        featuresRes.forEach((track) => {
          if (track) {
            const trackDetails = metadataRes?.find((t) => t?.id === track?.id);
            if (trackDetails) {
              const info = DjTrackInfo.fromQueries(track, trackDetails);
              trackDb[track.id] = info;
            }
          }
        });
        saveTrackDb();
      }
    } catch (error) {
      console.error("DJ Info: Error fetching batch track info:", error);
    }
  }
  
  return ids.map((id) => {
    if (trackDb[id]) return trackDb[id];
    return null;
  });
}