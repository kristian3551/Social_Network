const { User } = require('../db');
const {
    USER_NOT_ADMIN
} = require('../utils/messages');

module.exports = (req, res, next) => {
    const id = req.user_id;

    User.findOne({ where: { id }})
        .then(data => {
            if(data.toJSON().role == 0) next();
            else {
                throw {
                    message: USER_NOT_ADMIN
                }
            }
        })
        .catch(err => {
            res.status(501).send(err);
        });
}
