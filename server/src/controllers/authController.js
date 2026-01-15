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
      const result = await db.query(
        'INSERT INTO users (email, password, email_verified) VALUES ($1, $2, $3) RETURNING id, email',
        [email, hashed, true]
      );
      const user = result.rows[0];

      return res.status(201).json({ success: true, data: { user }, message: 'Registration successful.' });
    } catch (err) {
      // fallback: store user in local store (without verification for simplicity)
      const usersStore = localStore;
      const user = await usersStore.createResource({ name: email, description: 'local-user' });
      return res.status(201).json({ success: true, data: { user: { id: user.id, email } }, message: 'Registered (fallback)' });
    }
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    try {
      const result = await db.query('SELECT id, email, password, email_verified FROM users WHERE email = $1', [email]);
      if (!result.rows.length) return res.status(401).json({ success: false, data: null, message: 'Invalid credentials' });
      const user = result.rows[0];
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ success: false, data: null, message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return res.json({ success: true, data: { user: { id: user.id, email: user.email }, token }, message: 'Authenticated' });
    } catch (err) {
      // fallback: no live users table
      return res.status(401).json({ success: false, data: null, message: 'Auth not available (fallback)' });
    }
  } catch (err) {
    next(err);
  }
}


async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    try {
      const result = await db.query('SELECT id, email, created_at, email_verified FROM users WHERE id = $1', [userId]);
      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const user = result.rows[0];
      return res.json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;

    try {
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 1;

      if (email) {
        updateFields.push(`email = $${paramIndex++}`);
        updateValues.push(email);
      }

      if (password) {
        const hashed = await bcrypt.hash(password, 10);
        updateFields.push(`password = $${paramIndex++}`);
        updateValues.push(hashed);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }

      updateValues.push(userId);
      const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, created_at, email_verified`;

      const result = await db.query(query, updateValues);
      if (!result.rows.length) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const updatedUser = result.rows[0];
      return res.json({ success: true, data: updatedUser, message: 'Profile updated successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile, updateProfile };
