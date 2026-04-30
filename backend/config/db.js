const mongoose = require('mongoose');

const connectDB = async () => { 
    try {
        mongoose.set('strictQuery', false); // Disable strict query mode
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;