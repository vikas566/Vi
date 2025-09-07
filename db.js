const mongoose = require('mongoose');
const connectDB = async (uri) => {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB Connected');
};
module.exports = connectDB;