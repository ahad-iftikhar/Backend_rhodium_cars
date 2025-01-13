const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  model: {
    type: String,
    required: [true, "Please provide your car model"],
    minLength: 3,
  },
  price: {
    type: Number,
    required: [true, "Please provide a price of your vehicle"],
  },
  phone: {
    type: Number,
    required: [true, "Please provide your phone number"],
  },
  maxNumberOfPictures: {
    type: Number,
    required: [true, "Please provide maximum number of pictures"],
    min: 1,
    max: 10,
  },
  images: [
    {
      type: String,
      required: [true, "Please provide at least one image URL"],
    },
  ],
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
