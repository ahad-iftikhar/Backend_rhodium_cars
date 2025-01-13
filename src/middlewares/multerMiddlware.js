const multer = require("multer");
const sharp = require("sharp");
const uploadOnCloudinary = require("../utils/cloudinary");

//creating storage

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
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
