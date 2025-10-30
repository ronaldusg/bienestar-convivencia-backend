const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}

module.exports = { connectDB };
