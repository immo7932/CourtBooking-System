if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./routes/auth");

const centres=require("./routes/centres")
const createBooking = require("./routes/createBooking");

// express init
const app = express();
// mongoose init
const dbUrl = process.env.DB_URL;
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database connected");
}
main().catch((err) => console.log(err));

app.use(cors());

// middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello wprld");
});


app.use("/api/auth", authRoute);
app.use("/api/centres", centres);
app.use("/api/createBooking", createBooking);
// error handling middleware


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).json({ success: false, message: err.message }); //For development
});

const port = process.env.PORT || 8080;
app.listen(port, (req, res) => {
  console.log("Listening to the port 8080");
});
