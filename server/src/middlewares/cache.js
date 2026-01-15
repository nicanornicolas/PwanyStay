const { getClient } = require('../config/redis');

const DEFAULT_TTL = Number(process.env.CACHE_TTL || 60); // seconds

function cacheMiddleware(req, res, next) {
  // Only cache GET requests
  if (req.method !== 'GET') return next();

  const { client, connected } = getClient();
  // If there's no client or it's not connected, skip cache (avoid hanging calls)
  if (!client || !connected) return next();

  const key = `cache:${req.originalUrl}`;

  (async () => {
    try {
      const cached = await client.get(key);
      if (cached) {
        // Cached value is full JSON response body
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cached));
      }
      // Miss — patch res.json to store response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Store only on successful responses
        if (body && body.success) {
          client.setEx(key, DEFAULT_TTL, JSON.stringify(body)).catch(() => {});
        }
        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };
      next();
    } catch (err) {
      // If Redis errors, fallthrough to controller
      console.warn('Redis cache error:', err.message);
      return next();
    }
  })();
}

module.exports = cacheMiddleware;
