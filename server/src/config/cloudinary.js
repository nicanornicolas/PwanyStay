const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Named export for v4

// Ensure keys are loaded from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'pwanystay_properties',
      // Convert all images to webp to save mobile data for users
      format: 'webp', 
      // Force consistent 3:2 aspect ratio for the property grid
      transformation: [
        { width: 1200, height: 800, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      // Generate a unique filename to prevent overwriting
      public_id: `prop-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
  },
});

module.exports = storage;