const asyncStorage = {
  getItem: async () => null,
  setItem: async () => undefined,
  removeItem: async () => undefined,
  getAllKeys: async () => [],
  multiGet: async () => [],
  multiSet: async () => undefined,
  multiRemove: async () => undefined,
  mergeItem: async () => undefined,
  flushGetRequests: () => undefined,
};

export default asyncStorage;
