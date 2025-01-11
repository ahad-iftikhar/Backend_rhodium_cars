const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("MONGODB connected!!!");
  } catch (error) {
    console.error("MONGODB connection error: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
