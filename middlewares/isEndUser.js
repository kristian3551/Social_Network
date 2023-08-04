const {
    USER_NOT_END_USER
} = require('../utils/messages');

module.exports = (req, res, next) => {
    const role = req.userRole;

    if(role != 1) {
        res.status(401).send({
            message: USER_NOT_END_USER
        });

        return;
    }

    next();
}
