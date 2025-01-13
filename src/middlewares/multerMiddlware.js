const multer = require("multer");
const sharp = require("sharp");

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
    await Promise.all(
      req.files.map(async (image, i) => {
        const filename = `car-${image.originalname}-${Date.now()}-${
          i + 1
        }.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/cars/${filename}`);
        req.body.images.push(filename);
      })
    );
  } catch (error) {
    return res.status(400).json({
      success: "false",
      message: "Failed to upload images",
    });
  }

  next();
};
