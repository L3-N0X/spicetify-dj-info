/**
 * Hand-written decoder for the extended-metadata (kind 10) response.
 *
 * Depending on the request, Spotify returns the per-track entries either directly at the top level
 * (field 3) or wrapped in a nested array message (field 2). A schema-based decoder cannot describe
 * both (field 2 would have to be a number and a message at once), so this walks the wire format and
 * accepts either layout. Each entry yields `{ id, popularity, release_date }`; entries without
 * metadata are skipped.
 */

function readVarint(buf, pos) {
  let result = 0,
    shift = 0,
    b;
  do {
    if (pos >= buf.length) return [0, pos];
    b = buf[pos++];
    result |= (b & 0x7f) << shift;
    shift += 7;
  } while (b & 0x80);
  return [result >>> 0, pos];
}

function decodeZigZag(n) {
  return (n >>> 1) ^ -(n & 1);
}

function skipField(buf, pos, wireType) {
  if (wireType === 0) return readVarint(buf, pos)[1];
  if (wireType === 1) return pos + 8;
  if (wireType === 2) {
    const [len, nextPos] = readVarint(buf, pos);
    return nextPos + len;
  }
  if (wireType === 5) return pos + 4;
  return buf.length;
}

function decodeDateMessage(buf, start, end) {
  let pos = start,
    year = 0,
    month = 1,
    day = 1;
  while (pos < end) {
    const [tag, p1] = readVarint(buf, pos);
    pos = p1;
    const fieldNo = tag >>> 3,
      wire = tag & 7;
    if (wire === 0 && (fieldNo === 1 || fieldNo === 2 || fieldNo === 3)) {
      const [val, p2] = readVarint(buf, pos);
      pos = p2;
      const decoded = decodeZigZag(val);
      if (fieldNo === 1) year = decoded;
      else if (fieldNo === 2) month = decoded;
      else if (fieldNo === 3) day = decoded;
    } else {
      pos = skipField(buf, pos, wire);
    }
  }
  return { year, month, day };
}

function decodeAlbumMessage(buf, start, end) {
  let pos = start,
    date = null;
  while (pos < end) {
    const [tag, p1] = readVarint(buf, pos);
    pos = p1;
    const fieldNo = tag >>> 3,
      wire = tag & 7;
    if (fieldNo === 6 && wire === 2) {
      const [len, p2] = readVarint(buf, pos);
      date = decodeDateMessage(buf, p2, p2 + len);
      pos = p2 + len;
    } else {
      pos = skipField(buf, pos, wire);
    }
  }
  return date;
}

function decodeTrackMetadata(buf, start, end) {
  let pos = start,
    popularity = 0,
    releaseDate = null;
  while (pos < end) {
    const [tag, p1] = readVarint(buf, pos);
    pos = p1;
    const fieldNo = tag >>> 3,
      wire = tag & 7;
    if (fieldNo === 3 && wire === 2) {
      const [len, p2] = readVarint(buf, pos);
      releaseDate = decodeAlbumMessage(buf, p2, p2 + len);
      pos = p2 + len;
    } else if (fieldNo === 8 && wire === 0) {
      const [val, p2] = readVarint(buf, pos);
      popularity = decodeZigZag(val);
      pos = p2;
    } else {
      pos = skipField(buf, pos, wire);
    }
  }
  return { popularity, releaseDate };
}

function decodeTrackMetadataWrapper(buf, start, end) {
  let pos = start,
    meta = null;
  while (pos < end) {
    const [tag, p1] = readVarint(buf, pos);
    pos = p1;
    const fieldNo = tag >>> 3,
      wire = tag & 7;
    if (fieldNo === 2 && wire === 2) {
      const [len, p2] = readVarint(buf, pos);
      meta = decodeTrackMetadata(buf, p2, p2 + len);
      pos = p2 + len;
    } else {
      pos = skipField(buf, pos, wire);
    }
  }
  return meta;
}

function decodeResponseEntry(buf, start, end) {
  let pos = start,
    trackUri = '',
    meta = null;
  const decoder = new TextDecoder();
  while (pos < end) {
    const [tag, p1] = readVarint(buf, pos);
    pos = p1;
    const fieldNo = tag >>> 3,
      wire = tag & 7;
    if (fieldNo === 2 && wire === 2) {
      const [len, p2] = readVarint(buf, pos);
      trackUri = decoder.decode(buf.subarray(p2, p2 + len));
      pos = p2 + len;
    } else if (fieldNo === 3 && wire === 2) {
      const [len, p2] = readVarint(buf, pos);
      meta = decodeTrackMetadataWrapper(buf, p2, p2 + len);
      pos = p2 + len;
    } else {
      pos = skipField(buf, pos, wire);
    }
  }
  if (!meta || !trackUri) return null;
  const r = meta.releaseDate;
  const dateStr =
    (r?.year || '') +
    '-' +
    String(r?.month || 1).padStart(2, '0') +
    '-' +
    String(r?.day || 1).padStart(2, '0');
  return { id: trackUri.split(':')[2], popularity: meta.popularity, release_date: dateStr };
}

function decodeExtensionArray(buf, start, end, results) {
  let pos = start;
  while (pos < end) {
    const [tag, p1] = readVarint(buf, pos);
    pos = p1;
    const fieldNo = tag >>> 3,
      wire = tag & 7;
    if (fieldNo === 3 && wire === 2) {
      const [len, p2] = readVarint(buf, pos);
      const entry = decodeResponseEntry(buf, p2, p2 + len);
      if (entry) results.push(entry);
      pos = p2 + len;
    } else {
      pos = skipField(buf, pos, wire);
    }
  }
}

export function decodeExtendedMetadataResponse(buf) {
  let pos = 0;
  const results = [];
  while (pos < buf.length) {
    const [tag, p1] = readVarint(buf, pos);
    pos = p1;
    const fieldNo = tag >>> 3,
      wire = tag & 7;
    if (fieldNo === 2 && wire === 2) {
      const [len, p2] = readVarint(buf, pos);
      decodeExtensionArray(buf, p2, p2 + len, results);
      pos = p2 + len;
    } else if (fieldNo === 3 && wire === 2) {
      const [len, p2] = readVarint(buf, pos);
      const entry = decodeResponseEntry(buf, p2, p2 + len);
      if (entry) results.push(entry);
      pos = p2 + len;
    } else {
      pos = skipField(buf, pos, wire);
    }
  }
  return results;
}
