const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './common/settings/config.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));
