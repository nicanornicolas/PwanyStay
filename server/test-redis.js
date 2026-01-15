require('dotenv').config();
const redis = require('redis');

// Check if Redis is enabled
if (process.env.REDIS_ENABLED !== 'true') {
  console.log("❌ Redis is not enabled. Set REDIS_ENABLED=true in your .env file");
  process.exit(1);
}

const url = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;
console.log("Attempting to connect to Redis at:", url);

const client = redis.createClient({ url });

client.on('error', (err) => {
  console.error("❌ Redis Connection Error:", err.message);
  console.log("HINT: Make sure Redis is running locally or check your REDIS_URL");
  process.exit(1);
});

client.on('connect', () => {
  console.log("✅ Success! Connected to Redis");
});

client.connect().then(async () => {
  // Test basic operations
  try {
    await client.set('test_key', 'Hello from PwanyStay!');
    const value = await client.get('test_key');
    console.log("✅ Redis operations working! Retrieved:", value);

    // Clean up
    await client.del('test_key');
    console.log("✅ Test completed successfully");

    await client.quit();
    process.exit(0);
  } catch (err) {
    console.error("❌ Redis operation error:", err.message);
    await client.quit();
    process.exit(1);
  }
}).catch((err) => {
  console.error("❌ Redis connection failed:", err.message);
  process.exit(1);
});