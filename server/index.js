const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5500;

// Apply CORS middleware first
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Then register routes
app.use("/api/capsules", require("./routes/capsules"));

// Check if MongoDB URI is provided
if (!process.env.MONGO_URI) {
  console.error("❌ MongoDB URI is missing! Please check your .env file");
  console.log(
    "💡 Tip: Copy .env.example to .env and update with your database credentials"
  );
} else {
  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
