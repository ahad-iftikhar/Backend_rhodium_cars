const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (buffer) => {
  try {
    if (!buffer) return null;

    // Upload the buffer directly to cloudinary
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    console.log("File uploaded successfully on cloudinary ", response.url);
    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

module.exports = uploadOnCloudinary;
