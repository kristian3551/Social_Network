const {
    USER_NOT_ADMIN
} = require('../utils/messages');

module.exports = (req, res, next) => {
    const role = req.userRole;

    if(role != 0) {
        res.status(401).send({
            message: USER_NOT_ADMIN
        });

        return;
    }

    next();
}
