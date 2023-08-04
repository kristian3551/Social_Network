const { USER_NOT_LOGGED } = require('../utils/messages');
const { authCookieName } = require('../config');
const TokenBlacklistService = require('../services/TokenBlacklistService');

module.exports = (req, res, next) => {
    const token = req.cookies[authCookieName];

    if(!token) {
        res.status(401).send(USER_NOT_LOGGED);
        return;
    }

    TokenBlacklistService.find(token)
        .then(data => {
            if(!data) next();
            else {
                res.status(401).send(USER_NOT_LOGGED);
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
}
