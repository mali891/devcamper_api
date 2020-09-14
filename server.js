const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./common/settings/db');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config({ path: './common/settings/config.env' });

// Connect to DB
connectDB();

const app = express();

//Body parser
app.use(express.json());

// Logging middleware
if (process.env.NODE_ENV === 'dev') {
	app.use(morgan('dev'));
}

// Connect bootcamp routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Connect error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.brightBlue.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
	console.log(`Error: ${error.message}`.brightRed.bold);
	server.close(() => process.exit(1));
});
