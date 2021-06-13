export const getMainVariables = screen => {
  return screen.context.main;
};

export const setLoading = (screen, statusLoading) => {
  getMainVariables(screen).set('isLoading', statusLoading);
};

export const isLoading = screen => {
  return getMainVariables(screen).isLoading;
};

export const getCache = screen => {
  let cache = getMainVariables(screen).cache;
  return cache;
};

export const setDataCache = (screen, object) => {
  getMainVariables(screen).set('cache', {...getCache(screen), ...object});
};

export const getConfig = (screen, key) => {
  let config = getCache(screen)?.config;
  if (config) {
    return config.filter((item, index) => item.key == key)[0]?.value;
  }
  return null;
};
