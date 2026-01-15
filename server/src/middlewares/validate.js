function validateResource(req, res, next) {
  const { name } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, data: null, message: 'Invalid or missing `name` in request body' });
  }
  // sanitize a bit
  req.body.name = name.trim();
  next();
}

module.exports = { validateResource };
