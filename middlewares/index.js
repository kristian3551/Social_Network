const isAuth = require('./isAuth');
const isAdmin = require('./isAdmin');
const isEndUser = require('./isEndUser');
const { isEmailValid, isPasswordValid, isUsernameValid } = require('./validations');

module.exports = {
    isAuth,
    isAdmin,
    isEndUser,
    isEmailValid,
    isPasswordValid,
    isUsernameValid
}

