const Car = require("../models/carModel");

exports.createCar = async (req, res) => {
  try {
    const newCar = await Car.create(req.body);

    res.status(201).json({
      message: "success",
      data: {
        car: newCar,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car)
      res.status(404).json({
        status: "fail",
        message: "Car not found",
      });

    res.status(200).json({
      status: "success",
      data: { car },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();

    if (cars.length === 0)
      return res.status(404).json({
        status: "fail",
        message: error,
      });

    res.status(200).json({
      status: "success",
      data: { cars },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
