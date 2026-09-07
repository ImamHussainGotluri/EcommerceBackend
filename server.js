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

// Middleware - Allow CORS from multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    // allow configured origins or any localhost origin (dev servers)
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("localhost")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

// Log incoming Origin header for debugging CORS issues
app.use((req, res, next) => {
  console.log(
    "[CORS] Request Origin:",
    req.headers.origin,
    "->",
    req.method,
    req.originalUrl,
  );
  next();
});

app.use(cors(corsOptions));

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
