const CACHE_PREFIX = 'contenthub_cache_';
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour

export const setCache = (key, data) => {
  const cacheItem = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem));
};

export const getCache = (key) => {
  const cacheItem = localStorage.getItem(CACHE_PREFIX + key);
  if (!cacheItem) return null;

  const { data, timestamp } = JSON.parse(cacheItem);
  if (Date.now() - timestamp > CACHE_EXPIRATION) {
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }

  return data;
};

export const clearCache = () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
};