require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');

const config = require('./config');
const { URL_NOT_FOUND } = require('./utils/messages');

const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const endUserRouter = require('./routes/endUser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', endUserRouter);

app.use('*', (req, res) => {
    res.status(404).send({
        message: URL_NOT_FOUND
    });
})

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});
