export const extendedMetadataJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: 'Header', id: 1 },
        request: { type: 'Request', id: 2, rule: 'repeated' },
      },
    },
    Header: {
      fields: {
        country: { type: 'string', id: 1 },
        catalogue: { type: 'string', id: 2 },
        task_id: { type: 'bytes', id: 3 },
      },
    },
    Request: {
      fields: {
        entity_uri: { type: 'string', id: 1 },
        query: { type: 'Query', id: 2 },
      },
    },
    Query: {
      fields: {
        extension_kind: { type: 'uint32', id: 1 },
      },
    },
  },
};
