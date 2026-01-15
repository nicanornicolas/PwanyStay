const express = require('express');

const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.post('/', uploadController.uploadSingle);
router.post('/multiple', uploadController.uploadMultiple);

module.exports = router;
