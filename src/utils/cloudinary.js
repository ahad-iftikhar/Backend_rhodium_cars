const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (buffer, options = {}) => {
  try {
    if (!buffer) return null;

    // For large files (>10MB), use chunked upload
    const bufferSize = Buffer.byteLength(buffer);
    const isLargeFile = bufferSize > 10 * 1024 * 1024; // 10MB threshold

    const uploadOptions = {
      resource_type: "auto",
      chunk_size: isLargeFile ? 6000000 : undefined, // 6MB chunks for large files
      ...options,
    };

    // Upload the buffer directly to cloudinary
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", {
              message: error.message,
              http_code: error.http_code,
              name: error.name,
            });
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(buffer);
    });

    console.log("File uploaded successfully on cloudinary ", response.url);
    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error; // Re-throw to let calling code handle it
  }
};

module.exports = uploadOnCloudinary;
