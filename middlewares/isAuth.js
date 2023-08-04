const jwt = require('../utils/jwt');
const { authCookieName } = require('../config');
const { TokenBlacklist } = require('../db');
const { USER_NOT_LOGGED } = require('../utils/messages');

module.exports = (req, res, next) => {
    const token = req.cookies[authCookieName];

    if(!token) {
        res.status(501).send(USER_NOT_LOGGED);
        return;
    }

    Promise.all([
        jwt.verifyToken(token),
        TokenBlacklist.findOne({ where: { token } })
    ])
        .then(([data, blacklistToken]) => {
            if(blacklistToken)
                throw USER_NOT_LOGGED;

            req.userId = data.id;
            req.userRole = data.role;

            next();
        })
        .catch(() => {
            res.status(401).send(USER_NOT_LOGGED);
        });
}
