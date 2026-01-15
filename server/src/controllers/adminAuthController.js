const db = require('../config/postgres');
const localStore = require('../config/localStore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
      const result = await db.query('INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashed]);
      const admin = result.rows[0];
      const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return res.status(201).json({ success: true, data: { admin, token }, message: 'Admin registered' });
    } catch (err) {
      // fallback: store admin in local store
      const adminsStore = localStore;
      const admin = await adminsStore.createResource({ name: email, description: 'local-admin' });
      const token = jwt.sign({ id: admin.id, email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return res.status(201).json({ success: true, data: { admin: { id: admin.id, email }, token }, message: 'Admin registered (fallback)' });
    }
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    try {
      const result = await db.query('SELECT id, email, password FROM admins WHERE email = $1', [email]);
      if (!result.rows.length) return res.status(401).json({ success: false, data: null, message: 'Invalid admin credentials' });
      const admin = result.rows[0];
      const ok = await bcrypt.compare(password, admin.password);
      if (!ok) return res.status(401).json({ success: false, data: null, message: 'Invalid admin credentials' });
      const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return res.json({ success: true, data: { admin: { id: admin.id, email: admin.email }, token }, message: 'Admin authenticated' });
    } catch (err) {
      // fallback: no live admins table
      return res.status(401).json({ success: false, data: null, message: 'Admin auth not available (fallback)' });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };