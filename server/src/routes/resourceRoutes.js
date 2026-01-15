const express = require('express');
const router = express.Router();
const multer = require('multer');
const cache = require('../middlewares/cache');
const { validateResource } = require('../middlewares/validate');
const { validateResourceJoi } = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/authMiddleware');
const controller = require('../controllers/resourceController');
const storage = require('../config/cloudinary');

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET /api/resource -> list (public)
router.get('/', cache, controller.listResources);

// GET /api/resource/:id -> get single (public)
router.get('/:id', cache, controller.getResource);

// POST /api/resource -> create (authenticated)
router.post('/', authenticateToken, upload.single('image'), validateResource, validateResourceJoi, controller.createResource);

// GET /api/resource/my -> list user's resources (authenticated)
router.get('/my', authenticateToken, controller.listUserResources);

// PUT /api/resource/:id -> update user's resource (authenticated)
router.put('/:id', authenticateToken, validateResource, validateResourceJoi, controller.updateResource);

// DELETE /api/resource/:id -> delete user's resource (authenticated)
router.delete('/:id', authenticateToken, controller.deleteResource);

module.exports = router;
