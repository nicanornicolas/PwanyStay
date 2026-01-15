const express = require('express');
const cors = require('cors');
const path = require('path');
const resourceRoutes = require('./routes/resourceRoutes');
const authRoutes = require('./routes/authRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

const corsOptions = {
	origin: function (origin, callback) {
		// allow requests with no origin like mobile apps or curl (server-to-server)
		if (!origin) return callback(null, true);
		// allow explicit frontend URL
		if (origin === FRONTEND_URL) return callback(null, true);
		// during development, accept any localhost origin (different ports)
		if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost')) {
			console.log(`CORS: allowing localhost origin ${origin} in dev`);
			return callback(null, true);
		}
		// do not throw an error here; return false so CORS middleware simply
		// won't set the allow-origin header. We'll log to help debugging.
		console.warn(`CORS: rejecting origin ${origin}`);
		return callback(null, false);
	},
	credentials: true,
	exposedHeaders: ['X-Cache'],
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded files under /uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));


// Session support using Redis when available
const session = require('express-session');
const { getClient } = require('./config/redis');
let RedisStore;
try {
	RedisStore = require('connect-redis')(session);
} catch (e) {
	RedisStore = null;
}

const { client: redisClient, connected } = getClient();
if (connected && RedisStore && redisClient) {
	app.use(
		session({
			store: new RedisStore({ client: redisClient }),
			secret: process.env.SESSION_SECRET || 'dev_session_secret',
			resave: false,
			saveUninitialized: false,
			cookie: {
				secure: process.env.NODE_ENV === 'production',
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
				maxAge: 1000 * 60 * 60 * 24,
			},
		})
	);
	console.log('Session store: Redis');
} else {
	// fallback to memory store (not for production)
	app.use(
		session({
			secret: process.env.SESSION_SECRET || 'dev_session_secret',
			resave: false,
			saveUninitialized: false,
			cookie: {
				secure: process.env.NODE_ENV === 'production',
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			},
		})
	);
	console.log('Session store: Memory (fallback)');
}

app.use('/api/resource', resourceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
