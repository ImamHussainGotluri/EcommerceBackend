const cloudinary = require("cloudinary").v2;

const connectToCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_API,
    });
    console.log("✅ Cloudinary connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to Cloudinary:", error);
  }
};

module.exports = connectToCloudinary;
module.exports.cloudinary = cloudinary;
