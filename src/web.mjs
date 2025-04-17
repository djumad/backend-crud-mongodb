import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userController from "./controller/user-controller.mjs";
import cors from "cors";
import produkController from "./controller/produk-controller.mjs";
import errorHandler from "./middleware/error-middleware.mjs";
// Load environment variables dari .env
dotenv.config();

// Inisialisasi express
const web = express();

web.use(cors({
    origin: 'http://192.168.14.119:5175',
    optionsSuccessStatus: 200,
}))

// Middleware parsing JSON
web.use(express.json());

// Gunakan controller
web.use(userController);
web.use(produkController);
web.use(errorHandler);
web.use("/storage" , express.static("img"));
// Koneksi ke MongoDB
mongoose.connect("mongodb://localhost:27017/online_shop")
.then(() => {
  console.log("✅ MongoDB connected");

  // Start server setelah MongoDB terkoneksi
  web.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

export default web;