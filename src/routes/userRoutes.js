const express = require("express");
const {
  signup,
  login,
  logout,
  isLoggedIn,
} = require("../controllers/userControllers");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify").get(isLoggedIn);

module.exports = router;
