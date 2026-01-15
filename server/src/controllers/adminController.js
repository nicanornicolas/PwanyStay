const db = require('../config/postgres');

async function dashboard(req, res, next) {
  try {
    const resourcesResult = await db.query('SELECT COUNT(*) as total_resources FROM resources');
    const usersResult = await db.query('SELECT COUNT(*) as total_users FROM users');
    const totalResources = parseInt(resourcesResult.rows[0].total_resources);
    const totalUsers = parseInt(usersResult.rows[0].total_users);

    // Listings by location
    const listingsByLocationResult = await db.query('SELECT location, COUNT(*) as count FROM resources GROUP BY location ORDER BY count DESC');
    const listingsByLocation = listingsByLocationResult.rows.map(row => ({ location: row.location, count: parseInt(row.count) }));

    // User growth over time (monthly)
    const userGrowthResult = await db.query("SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as count FROM users GROUP BY month ORDER BY month");
    const userGrowth = userGrowthResult.rows.map(row => ({ month: row.month.toISOString().substring(0, 7), count: parseInt(row.count) }));

    // Revenue (sum of prices)
    const revenueResult = await db.query('SELECT COALESCE(SUM(price), 0) as total_revenue FROM resources');
    const totalRevenue = parseFloat(revenueResult.rows[0].total_revenue);

    res.json({
      success: true,
      data: {
        totalResources,
        totalUsers,
        listingsByLocation,
        userGrowth,
        totalRevenue
      },
      message: 'Admin dashboard'
    });
  } catch (err) {
    next(err);
  }
}

async function getAllResources(req, res, next) {
  try {
    const result = await db.query('SELECT id, name, description, price, image, location, tags, images, created_at FROM resources ORDER BY id DESC');
    res.json({ success: true, data: result.rows, message: 'Resources fetched' });
  } catch (err) {
    next(err);
  }
}

async function updateResource(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, image, location, tags, images } = req.body;
    const tagsParam = Array.isArray(tags) ? JSON.stringify(tags) : null;
    const imagesParam = Array.isArray(images) ? JSON.stringify(images) : null;
    const result = await db.query(
      'UPDATE resources SET name = $1, description = $2, price = $3, image = $4, location = $5, tags = $6::jsonb, images = $7::jsonb WHERE id = $8 RETURNING *',
      [name, description, price, image, location, tagsParam, imagesParam, id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, data: result.rows[0], message: 'Resource updated' });
  } catch (err) {
    next(err);
  }
}

async function deleteResource(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM resources WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, message: 'Resource deleted' });
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const result = await db.query('SELECT id, email, created_at FROM users ORDER BY id DESC');
    res.json({ success: true, data: result.rows, message: 'Users fetched' });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const result = await db.query('UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email, created_at', [email, id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: result.rows[0], message: 'User updated' });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, getAllResources, updateResource, deleteResource, getAllUsers, updateUser, deleteUser };