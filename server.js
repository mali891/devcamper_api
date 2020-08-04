const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const bootcamps = require('./routes/bootcamps');
const URLS = require('./common/constants/urls');

dotenv.config({ path: './common/settings/config.env' });

const app = express();

if (process.env.NODE_ENV === 'dev') {
	app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));
