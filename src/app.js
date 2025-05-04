const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const carRouter = require("./routes/carRoutes");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   })
// );

// // Update OPTIONS handling
// app.options(
//   "*",
//   cors({
//     origin: process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//   })
// );

const corsOptions: cors.CorsOptions = {
    origin: (
      origin,
      callback
    ) => {
      const allowedOrigins = [
        'http://localhost:3000', // Your local development
        'http://localhost:5173', // Your local development
        'https://carhub-market.vercel.app'
        // Add other allowed origins as needed
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

// Add temporary file directory configuration
const tmpDirectory = process.env.NODE_ENV === "production" ? "/tmp" : "public";
app.use(express.static(tmpDirectory));

app.enable("trust proxy");

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/cars", carRouter);

module.exports = { app };
