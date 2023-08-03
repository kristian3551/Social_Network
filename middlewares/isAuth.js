const jwt = require('../utils/jwt');
const { authCookieName } = require('../config');
const { TokenBlacklist } = require('../db');
const { USER_NOT_LOGGED } = require('../utils/messages');

module.exports = (req, res, next) => {
    const token = req.cookies[authCookieName];
    if(!token)
        res.status(501).send(USER_NOT_LOGGED);

    Promise.all([
        jwt.verifyToken(token),
        TokenBlacklist.findOne({ where: { token } })
    ])
        .then(([data, blacklistToken]) => {
            if(blacklistToken)
                throw "Used token"

            req.userId = data.id;
            next();
        })
        .catch(() => {
            res.status(401).send(USER_NOT_LOGGED);
        });
}
