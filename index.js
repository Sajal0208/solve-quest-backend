require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db')
const helmet = require('helmet')
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}


// Middleware
app.use(express.json());
app.use(helmet())
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }));

// Connect to Local MongoDB
connectDB()

// Routes
app.use('/user', require('./routes/userRoutes'))
app.use('/problem', require('./routes/problemRoutes'))

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
