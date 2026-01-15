const db = require('../config/postgres');
const localStore = require('../config/localStore');

// Helper to attempt a DB query with a timeout and fallback to local store
function withDbTimeout(promise, timeoutMs = 4000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('DB timeout')), timeoutMs);
  });
  // When the main promise settles, clear the timeout to avoid open handles
  const wrapped = Promise.race([promise.finally(() => clearTimeout(timer)), timeoutPromise]);
  return wrapped;
}

async function listResources(req, res, next) {
  try {
    console.log('listResources: received request with query:', req.query);
    try {
      const { town, type, minPrice, maxPrice, bedrooms, search } = req.query;

      let query = 'SELECT id, name, description, price, image, location, tags, images, bedrooms, type, status, created_at FROM resources WHERE status = \'active\'';
      const params = [];
      const whereClauses = [];

      // Location filter
      if (town && town !== 'All') {
        params.push(town);
        whereClauses.push(`location = $${params.length}`);
      }

      // Type filter
      if (type && type !== 'All') {
        params.push(type);
        whereClauses.push(`type = $${params.length}`);
      }

      // Bedrooms filter
      if (bedrooms && bedrooms !== 'Any') {
        const beds = parseInt(bedrooms);
        if (!isNaN(beds)) {
          if (bedrooms === '4+') {
            params.push(4);
            whereClauses.push(`bedrooms >= $${params.length}`);
          } else {
            params.push(beds);
            whereClauses.push(`bedrooms = $${params.length}`);
          }
        }
      }

      // Price range filter
      if (minPrice && maxPrice) {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if (!isNaN(min) && !isNaN(max)) {
          params.push(min, max);
          whereClauses.push(`price BETWEEN $${params.length - 1} AND $${params.length}`);
        }
      }

      // Search filter (name or location)
      if (search && search.trim()) {
        params.push(`%${search.trim()}%`);
        whereClauses.push(`(name ILIKE $${params.length} OR location ILIKE $${params.length})`);
      }

      // Add additional WHERE clauses if any
      if (whereClauses.length > 0) {
        query += ' AND ' + whereClauses.join(' AND ');
      }

      query += ' ORDER BY created_at DESC';

      console.log('Final query:', query, 'Params:', params);
      const result = await withDbTimeout(db.query(query, params));
      console.log('listResources: db query returned rows=', (result.rows || []).length);

      // Map DB rows to the shape frontend expects (without inventing defaults)
      const mapped = (result.rows || []).map(mapResource);
      return res.json({ success: true, data: mapped, message: 'Resources fetched' });
    } catch (err) {
      // fallback to local store
      console.warn('listResources: db query failed or timed out, using fallback:', err.message);
      const rows = await localStore.listResources();
      console.log('listResources: fallback rows=', rows.length);
      const mapped = (rows || []).map(mapResource);
      return res.json({ success: true, data: mapped, message: 'Resources fetched (fallback)' });
    }
  } catch (err) {
    next(err);
  }
}

async function getResource(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, data: null, message: 'Invalid id' });
    console.log('getResource: id=', id);
    try {
      const result = await withDbTimeout(db.query('SELECT id, name, description, price, image, location, tags, images, created_at FROM resources WHERE id = $1', [id]));
      console.log('getResource: db returned rows=', result.rows.length);
      if (!result.rows.length) return res.status(404).json({ success: false, data: null, message: 'Resource not found' });
      return res.json({ success: true, data: mapResource(result.rows[0]), message: 'Resource fetched' });
    } catch (err) {
      console.warn('getResource: db error/timed out, fallback', err.message);
      const item = await localStore.getResource(id);
      if (!item) return res.status(404).json({ success: false, data: null, message: 'Resource not found (fallback)' });
      return res.json({ success: true, data: mapResource(item), message: 'Resource fetched (fallback)' });
    }
  } catch (err) {
    next(err);
  }
}

async function createResource(req, res, next) {
  try {
    const { name, description, price, location, tags, bedrooms, type } = req.body;
    const userId = req.user ? req.user.id : null;

    // Get image URL from Cloudinary upload (req.file.path) or use provided URL
    const imageUrl = req.file ? req.file.path : req.body.image || null;

    console.log('createResource: name=', name, 'userId=', userId, 'imageUrl=', imageUrl ? 'provided' : 'none');
    try {
      // Prepare tags as JSON when provided so it fits jsonb column safely
      const tagsParam = Array.isArray(tags)
        ? JSON.stringify(tags)
        : typeof tags === 'string' && tags.trim()
        ? JSON.stringify(tags.split(',').map((t) => t.trim()).filter(Boolean))
        : null;

      const imagesParam = Array.isArray(req.body.images)
        ? JSON.stringify(req.body.images)
        : null;

      const values = [name, description || null, price || null, imageUrl, location || null, tagsParam, imagesParam, bedrooms || 1, type || 'Apartment', userId];
      const result = await withDbTimeout(
        db.query(
          'INSERT INTO resources (name, description, price, image, location, tags, images, bedrooms, type, user_id) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10) RETURNING id, name, description, price, image, location, tags, images, bedrooms, type, status, created_at',
          values
        )
      );
      console.log('createResource: db insert ok id=', (result.rows[0] && result.rows[0].id));
      return res.status(201).json({ success: true, data: mapResource(result.rows[0]), message: 'Resource created' });
    } catch (err) {
      // persist to local fallback store
      console.warn('createResource: db insert failed/timed out, fallback', err.message);
      const item = await localStore.createResource({
        name,
        description,
        price,
        image: imageUrl,
        location,
        tags,
        images: req.body.images,
        bedrooms: bedrooms || 1,
        type: type || 'Apartment',
        user_id: userId
      });
      console.log('createResource: fallback created id=', item.id);
      return res.status(201).json({ success: true, data: mapResource(item), message: 'Resource created (fallback)' });
    }
  } catch (err) {
    next(err);
  }
}

async function listUserResources(req, res, next) {
  try {
    const userId = req.user.id;
    console.log('listUserResources: userId=', userId);
    try {
      const result = await withDbTimeout(db.query('SELECT id, name, description, price, image, location, tags, images, created_at FROM resources WHERE user_id = $1 ORDER BY id DESC', [userId]));
      console.log('listUserResources: db query returned rows=', (result.rows || []).length);
      const mapped = (result.rows || []).map(mapResource);
      return res.json({ success: true, data: mapped, message: 'User resources fetched' });
    } catch (err) {
      console.warn('listUserResources: db query failed or timed out, using fallback:', err.message);
      // For fallback, we can't filter by user, so return empty
      return res.json({ success: true, data: [], message: 'User resources fetched (fallback)' });
    }
  } catch (err) {
    next(err);
  }
}

async function updateResource(req, res, next) {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;
    if (!id) return res.status(400).json({ success: false, data: null, message: 'Invalid id' });
    const { name, description, price, image, location, tags } = req.body;
    console.log('updateResource: id=', id, 'userId=', userId);

    const tagsParam = Array.isArray(tags)
      ? JSON.stringify(tags)
      : typeof tags === 'string' && tags.trim()
      ? JSON.stringify(tags.split(',').map((t) => t.trim()).filter(Boolean))
      : null;

    const imagesParam = Array.isArray(req.body.images)
      ? JSON.stringify(req.body.images)
      : null;

    try {
      const result = await withDbTimeout(
        db.query(
          'UPDATE resources SET name = $1, description = $2, price = $3, image = $4, location = $5, tags = $6::jsonb, images = $7::jsonb WHERE id = $8 AND user_id = $9 RETURNING id, name, description, price, image, location, tags, images, created_at',
          [name, description || null, price || null, image || null, location || null, tagsParam, imagesParam, id, userId]
        )
      );
      if (!result.rows.length) return res.status(404).json({ success: false, data: null, message: 'Resource not found or not owned by user' });
      return res.json({ success: true, data: mapResource(result.rows[0]), message: 'Resource updated' });
    } catch (err) {
      console.warn('updateResource: db update failed/timed out', err.message);
      return res.status(500).json({ success: false, data: null, message: 'Update failed' });
    }
  } catch (err) {
    next(err);
  }
}

async function deleteResource(req, res, next) {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;
    if (!id) return res.status(400).json({ success: false, data: null, message: 'Invalid id' });
    console.log('deleteResource: id=', id, 'userId=', userId);

    try {
      const result = await withDbTimeout(
        db.query('DELETE FROM resources WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId])
      );
      if (!result.rows.length) return res.status(404).json({ success: false, data: null, message: 'Resource not found or not owned by user' });
      return res.json({ success: true, data: null, message: 'Resource deleted' });
    } catch (err) {
      console.warn('deleteResource: db delete failed/timed out', err.message);
      return res.status(500).json({ success: false, data: null, message: 'Delete failed' });
    }
  } catch (err) {
    next(err);
  }
}

// Map a stored resource to the fields expected by the frontend.
// Important: do not fabricate values — only rename/normalize existing fields when present.
function mapResource(r) {
  if (!r) return r;
  const out = {
    id: r.id,
    // keep original name for reference
    name: r.name || null,
    // title is what the frontend prefers; use title if present, otherwise fall back to name
    title: r.title || r.name || null,
    description: r.description || null,
    created_at: r.created_at || null,
  };

  // Optional fields: include only if present and appear valid
  if (typeof r.price === 'number') out.price = r.price;
  else if (r.price && !isNaN(Number(r.price))) out.price = Number(r.price);

  if (r.image && typeof r.image === 'string') out.image = r.image;
  if (Array.isArray(r.images) && r.images.length) out.images = r.images;
  else if (r.images && typeof r.images === 'string') {
    try { out.images = JSON.parse(r.images); } catch (e) { out.images = [r.images]; }
  }
  if (r.location && typeof r.location === 'string') out.location = r.location;

  if (Array.isArray(r.tags)) out.tags = r.tags;
  else if (typeof r.tags === 'string' && r.tags.trim().length) {
    // accept comma-separated tags if the backing store used a simple string
    out.tags = r.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  return out;
}

module.exports = { listResources, getResource, createResource, listUserResources, updateResource, deleteResource };
