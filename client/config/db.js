require("dotenv").config();
const mongoose = require("mongoose");

const DEFAULT_MONGO_URI =
  "mongodb+srv://Aman_Agarwal18:xmZqgdnlLLwqU3ai@cluster-vitalsync.r0hfkwh.mongodb.net/?appName=Cluster-VitalSync";

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  try {
    await mongoose.connect(primaryUri, { 
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("Primary MongoDB Connection Error:", err.message);
    if (primaryUri !== DEFAULT_MONGO_URI) {
      console.log("Attempting connection with fallback MongoDB URI...");
      try {
        await mongoose.connect(DEFAULT_MONGO_URI, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          retryWrites: true,
          w: "majority",
        });
        console.log("✅ MongoDB Connected (Fallback)");
        return;
      } catch (fallbackErr) {
        console.error("Fallback MongoDB Connection Error:", fallbackErr.message);
      }
    }
  }
};

module.exports = connectDB;