const { User } = require('../db');
const {
    USER_NOT_END_USER
} = require('../utils/messages');

module.exports = (req, res, next) => {
    const id = req.userId;

    User.findOne({ where: { id }})
        .then(data => {
            if(data.toJSON().role == 1) next();
            else {
                throw {
                    message: USER_NOT_END_USER
                }
            }
        })
        .catch(err => {
            res.status(501).send(err);
        });
}
