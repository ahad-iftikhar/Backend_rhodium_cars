const express = require("express");
const {
  signup,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/get-current-user").get(getCurrentUser);

module.exports = router;
