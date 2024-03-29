const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", err => {
  console.log("uncaughtException", err.name);
  console.log(err);
  process.exit(1); //exitting
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

//const connectDB = require("./config/db");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//connect to database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("db connection successfull"));

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () =>
  console.log(`started sevver on PORT ${PORT}`)
);

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION");
  server.close(() => {
    process.exit(1); //exitting
  });
});
