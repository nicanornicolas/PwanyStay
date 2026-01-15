const redis = require('redis');

let client = null;
let connected = false;
let triedConnecting = false;

function getClient() {
  // Redis is disabled by default to simplify local development.
  // Set REDIS_ENABLED=true in your environment to enable Redis.
  if (process.env.REDIS_ENABLED !== 'true') {
    if (!triedConnecting) triedConnecting = true;
    return { client: null, connected: false };
  }
  // When running tests, avoid attempting to connect to Redis
  if (process.env.NODE_ENV === 'test') {
    triedConnecting = true;
    return { client: null, connected: false };
  }

  // If we've already tried to connect and failed, don't re-create client on every request
  if (client) return { client, connected };
  if (triedConnecting && !connected) return { client: null, connected: false };

  triedConnecting = true;
  const url = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;
  client = redis.createClient({ url });

  // Try to connect but don't crash the app if Redis is unavailable
  (async () => {
    try {
      await client.connect();
      connected = true;
      console.log('Connected to Redis');
    } catch (err) {
      console.warn('Redis not available, continuing without cache:', err.message);
      // leave client set so we don't keep re-trying to create new clients on each request
      connected = false;
    }
  })();

  return { client, connected };
}

module.exports = { getClient };
