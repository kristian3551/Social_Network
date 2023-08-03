require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');

const config = require('./config');

const adminRouter = require('./routes/admin');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', adminRouter);

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
