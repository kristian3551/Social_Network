const jwt = require('../utils/jwt');
const { authCookieName } = require('../config');
const { USER_NOT_LOGGED } = require('../utils/messages');

module.exports = (req, res, next) => {
    const token = req.cookies[authCookieName];

    if(!token) {
        res.status(401).send(USER_NOT_LOGGED);
        return;
    }

    try {
        const data = jwt.verifyToken(token);

        req.userId = data.id;
        req.userRole = data.role;

        next();
    }
    catch(err) {
        res.status(401).send(USER_NOT_LOGGED);
    }
}
