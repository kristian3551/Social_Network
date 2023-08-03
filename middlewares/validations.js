const { isEmail } = require('validator');

const {
    EMAIL_NOT_VALID,
    PASSWORD_TOO_SHORT,
    USERNAME_NOT_VALID
} = require('../utils/messages');

const isEmailValid = (req, res, next) => {
    const { email } = req.body;

    if(email == undefined) {
        next();
        return;
    }

    if(!isEmail(email)) {
        res.status(400).json({
            message: EMAIL_NOT_VALID
        });
        return;
    }

    next();
}

const isUsernameValid = (req, res, next) => {
    const { username } = req.body;

    if(!username) {
        res.status(400).json({
            message: USERNAME_NOT_VALID
        });
        return;
    }
    next();
}

const isPasswordValid = (req, res, next) => {
    const { password } = req.body;

    if(password.length < 8) {
        res.status(400).json({
            message: PASSWORD_TOO_SHORT
        });
        return;
    }

    next();
}

module.exports = {
    isEmailValid,
    isPasswordValid,
    isUsernameValid
}
