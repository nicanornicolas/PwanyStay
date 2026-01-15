const express = require('express');
const router = express.Router();
const { dashboard, getAllResources, updateResource, deleteResource, getAllUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticateToken, requireAdmin, dashboard);

// Resource management routes
router.get('/resources', authenticateToken, requireAdmin, getAllResources);
router.put('/resources/:id', authenticateToken, requireAdmin, updateResource);
router.delete('/resources/:id', authenticateToken, requireAdmin, deleteResource);

// User management routes
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;