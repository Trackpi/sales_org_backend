const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,  // Replace with your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_NAME_API_KEY,        // Replace with your Cloudinary API key
    api_secret: process.env.CLOUDINARY_SECRET_KEY  // Replace with your Cloudinary API secret
  });

  module.exports = cloudinary;
