const multer = require('multer');
const storage = require('../config/cloudinary');

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

function uploadSingle(req, res, next) {
  const handler = upload.single('image');
  handler(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ success: false, data: null, message: 'No file uploaded' });
    // Cloudinary provides the URL directly in req.file.path
    return res.status(201).json({ success: true, data: { url: req.file.path }, message: 'File uploaded' });
  });
}

function uploadMultiple(req, res, next) {
  const handler = upload.array('images', 12);
  handler(req, res, (err) => {
    if (err) return next(err);
    if (!req.files || !req.files.length) return res.status(400).json({ success: false, data: null, message: 'No files uploaded' });
    // Cloudinary provides URLs directly in req.files[].path
    const urls = req.files.map((f) => f.path);
    return res.status(201).json({ success: true, data: { urls }, message: 'Files uploaded' });
  });
}

module.exports = { uploadSingle, uploadMultiple };
