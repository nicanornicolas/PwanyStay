require('dotenv').config();
const app = require('./app');
const redis = require('./config/redis');

const PORT = process.env.PORT || 4000;

// Attempt to warm up Redis connection (fails gracefully inside module)
redis.getClient();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
