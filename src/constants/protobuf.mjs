export const extendedMetadataJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        request: { type: "Request", id: 2, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        country: { type: "string", id: 1 },
        catalogue: { type: "string", id: 2 },
        task_id: { type: "bytes", id: 3 },
      },
    },
    Request: {
      fields: {
        entity_uri: { type: "string", id: 1 },
        query: { type: "Query", id: 2 },
      },
    },
    Query: {
      fields: {
        extension_kind: { type: "uint32", id: 1 },
      },
    },
  },
};

export const audioFeaturesJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        extension_kind: { type: "uint32", id: 2 },
        response: { type: "Response", id: 3, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    Response: {
      fields: {
        info: { type: "ResponseInfo", id: 1 },
        track: { type: "string", id: 2 },
        attributes: { type: "AudioAttributesWrapper", id: 3, rule: "optional" },
      },
    },
    ResponseInfo: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    AudioAttributesWrapper: {
      fields: {
        typestr: { type: "string", id: 1 },
        attributes: { type: "AudioAttributes", id: 2 },
      },
    },
    AudioAttributes: {
      fields: {
        bpm: { type: "double", id: 1 },
        key: { type: "Key", id: 2 },
      },
    },
    Key: {
      fields: {
        key: { type: "string", id: 1 },
        majorMinor: { type: "uint32", id: 2 },
        camelot: { type: "CamelotKey", id: 3 },
      },
    },
    CamelotKey: {
      fields: {
        key: { type: "string", id: 1 },
        backgroundColor: { type: "string", id: 2 },
      },
    },
  },
};

export const trackMetadataJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        extension_kind: { type: "uint32", id: 2 },
        response: { type: "Response", id: 3, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    Response: {
      fields: {
        info: { type: "ResponseInfo", id: 1 },
        track: { type: "string", id: 2 },
        metadata: { type: "TrackMetadataWrapper", id: 3, rule: "optional" },
      },
    },
    ResponseInfo: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    TrackMetadataWrapper: {
      fields: {
        typestr: { type: "string", id: 1 },
        metadata: { type: "TrackMetadata", id: 2 },
      },
    },
    TrackMetadata: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
        album: { type: "AlbumMetadata", id: 3 },
        artist: { type: "Artist", id: 4, rule: "repeated" },
        track_num: { type: "sint32", id: 5 },
        disc_num: { type: "sint32", id: 6 },
        duration_ms: { type: "sint32", id: 7 },
        popularity: { type: "sint32", id: 8 },
      },
    },
    AlbumMetadata: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
        artist: { type: "Artist", id: 3, rule: "repeated" },
        release_date: { type: "Date", id: 6, rule: "optional" },
      },
    },
    Artist: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
      },
    },
    Date: {
      fields: {
        year: { type: "sint32", id: 1 },
        month: { type: "sint32", id: 2, rule: "optional" },
        day: { type: "sint32", id: 3, rule: "optional" },
      },
    },
  },
};
