// server.js or app.js

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./routes/auth");


const centres = require("./routes/centres");
const createBooking = require("./routes/createBooking");
const Users1 = require("./routes/users"); // Corrected route import

// Express initialization
const app = express();

// Mongoose initialization
const dbUrl = process.env.DB_URL;
async function main() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database connected");
}
main().catch((err) => console.log(err));

// CORS Configuration
app.use(cors())

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoute);
app.use("/api/centres", centres);
app.use("/api/createBooking", createBooking);
app.use("/api/User", Users1);

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).json({ success: false, message: err.message });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
