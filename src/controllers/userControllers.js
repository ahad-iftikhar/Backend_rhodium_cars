const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  console.log("TOKEENNNNN", token);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    // httpOnly: true,
    // sameSite: "None",
    // Credential: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  console.log("In controlleer vefore user");
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
  });
  console.log("In controlleer");

  createSendToken(newUser, 201, req, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exists.
  if (!email || !password) {
    return res.status(401).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  createSendToken(user, 200, req, res);
};

exports.logout = async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      res.status(200).json({
        status: "success",
        user: currentUser,
      });
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

exports.getCurrentUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log("coolies", req.cookies);

  console.log("Token", token);

  if (!token)
    return res.status(401).json({
      status: false,
      message: "User is not loggedin, Login to get access!",
    });

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exits
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: false,
      message: "The user belonging to this token does no longer exist.",
    });
  }

  return res.status(200).json({
    status: true,
    message: "User exists",
    data: { currentUser },
  });
};
