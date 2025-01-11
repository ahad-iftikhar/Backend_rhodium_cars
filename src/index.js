const dotenv = require("dotenv");
const connectDB = require("./db/index");
const { app } = require("./app");

dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed !!! ", error);
  });
