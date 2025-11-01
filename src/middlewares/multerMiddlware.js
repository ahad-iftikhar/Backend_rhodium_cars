const multer = require("multer");
const sharp = require("sharp");
const uploadOnCloudinary = require("../utils/cloudinary");

//creating storage

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for images
  },
});

// middlewares

exports.uploadCarImages = upload.array("images", 10);

exports.handleImages = async (req, res, next) => {
  try {
    if (!req.files) return next();
    req.body.images = [];

    const cloudinaryUrls = await Promise.all(
      req.files.map(async (file) => {
        // Process image with sharp
        const processedBuffer = await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        // Upload processed buffer to Cloudinary
        const cloudinaryResult = await uploadOnCloudinary(processedBuffer);

        return cloudinaryResult.url;
      })
    );

    // Update req.body with Cloudinary URLs
    req.body.images = cloudinaryUrls;
  } catch (error) {
    return res.status(400).json({
      success: "false",
      message: "Failed to upload images",
    });
  }

  next();
};

// Accept only video files
const multerVideoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("Not a video! Please upload only videos."), false);
  }
};

// Configure multer for single video upload
const uploadVideo = multer({
  storage: multerStorage,
  fileFilter: multerVideoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for videos
  },
});

exports.uploadSingleVideo = uploadVideo.single("video");

exports.handleVideoUpload = async (req, res, next) => {
  try {
    if (!req.file) return next();

    // Check file size before uploading
    const fileSize = req.file.buffer.length;
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (fileSize > maxSize) {
      return res.status(413).json({
        success: false,
        message: `File size (${(fileSize / 1024 / 1024).toFixed(
          2
        )}MB) exceeds maximum allowed size (100MB)`,
      });
    }

    const cloudinaryResult = await uploadOnCloudinary(req.file.buffer, {
      resource_type: "video",
    });

    if (!cloudinaryResult || !cloudinaryResult.url) {
      return res.status(400).json({
        success: false,
        message: "Failed to upload video to Cloudinary",
      });
    }

    console.log("cloudinaryURL: ", cloudinaryResult.url);
    req.body.video = cloudinaryResult.url;
    next();
  } catch (error) {
    console.error("Video upload error:", error);

    // Handle specific Cloudinary errors
    if (error.http_code === 413) {
      return res.status(413).json({
        success: false,
        message:
          "File too large. Maximum size is 100MB. Please try a smaller file or compress the video.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to upload video",
    });
  }
};
