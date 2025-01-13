const express = require("express");
const {
  createCar,
  getAllCars,
  getCar,
} = require("../controllers/carControllers");
const {
  uploadCarImages,
  handleImages,
} = require("../middlewares/multerMiddlware");

const router = express.Router();

router.route("/add-new-car").post(uploadCarImages, handleImages, createCar);
router.route("/").get(getAllCars);
router.route("/:id").get(getCar);

module.exports = router;
