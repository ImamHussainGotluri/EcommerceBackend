const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./config/mongoose");
const connectToCloudinary = require("./config/cloudinary");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
dotenv.config();

// Connect to MongoDB
connectToMongo();

//connect to cloudinary
connectToCloudinary();

//app initialization
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());

// Body parsers with type checking to exclude multipart
app.use(express.json({ limit: "50mb", type: "application/json" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    type: "application/x-www-form-urlencoded",
  }),
);

//api endpoints
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
