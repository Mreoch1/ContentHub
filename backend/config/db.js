const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
