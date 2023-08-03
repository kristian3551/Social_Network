const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

const { User, TokenBlacklist } = require('../db');

const { USER_NOT_FOUND,
        PASSWORD_INCORRECT,
        USER_LOGGED_IN,
        USER_LOGGED_OUT
} = require('../utils/messages');

const { authCookieName } = require('../config');

module.exports = {
    post: {
        login: (req, res) => {
            const { username, password } = req.body;

            User.findOne({ where: { username }})
                .then(user => {
                    if(!user) throw {
                        message: USER_NOT_FOUND
                    }
                    return Promise.all([
                        bcrypt.compare(password, user.toJSON().password),
                        user
                    ]);
                })
                .then(([match, user]) => {
                    if(!match)
                        throw {
                            message: PASSWORD_INCORRECT
                        };
                    const token = jwt.createToken({
                        id: user.toJSON().id
                    });

                    console.log(user.toJSON().id);

                    res.cookie(authCookieName, token).status(200).json({
                        message: USER_LOGGED_IN
                    });
                })
                .catch(err => {
                    res.status(501).json(err);
                });
        },
        logout: (req, res) => {
            const token = req.cookies[authCookieName];

            TokenBlacklist.create({ token })
                .then(() => {
                    res.clearCookie(authCookieName).status(200).json({
                        message: USER_LOGGED_OUT
                    });
                })
                .catch(err => {
                    res.status(501).send(err);
                })
        }
    }
}
