const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

//const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware setup 
/* app.use(cors()); */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
// Routes
app.use("/post", require("./routes/post.routes"));

// Start the server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();