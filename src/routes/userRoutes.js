const express = require("express");
const {
  signup,
  login,
  logout,
  isLoggedIn,
} = require("../controllers/userControllers");
const {
  uploadSingleVideo,
  handleVideoUpload,
} = require("../middlewares/multerMiddlware");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify").get(isLoggedIn);

router
  .route("/yapzap/upload")
  .post(uploadSingleVideo, handleVideoUpload, (req, res) => {
    res.status(200).json({ message: "success" });
  });

module.exports = router;
