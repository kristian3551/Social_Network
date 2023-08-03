const { User } = require('../db');

const { PAGE_NOT_PASSED,
        USER_CREATED,
        PASSWORD_UPDATED,
        USER_NOT_FOUND,
        USER_DELETED
} = require('../utils/messages');

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const MAX_PER_PAGE = 5;

module.exports = {
    get: {
        users: (req, res) => {
            const { page } = req.query;
            if(!page) {
                res.status(501).json({
                    message: PAGE_NOT_PASSED
                });
                return;
            }

            User.findAll({
                order: [['username']], 
                limit: MAX_PER_PAGE, offset: MAX_PER_PAGE * (page - 1) 
            })
                .then(data => {
                    const users = data.map(rawUser => rawUser.toJSON());
                    res.status(200).json(users);
                })
                .catch(err => {
                    res.status(501).send(err);
                });
        }
    },
    post: {
        user: (req, res) => {
            const { username, email, password, role } = req.body;

            bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
                if(err) {
                    res.status(501).send(err);
                    return;
                }
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) {
                        res.status(501).send(err);
                    }
                    else {
                        User.create({
                            username,
                            email,
                            password: hash,
                            role
                        })
                            .then(() => {
                                res.status(200).json({
                                    message: USER_CREATED
                                });
                            })
                            .catch(err => {
                                res.status(501).json(err);
                            });
                    }
                });
            });
        }
    },
    patch: {
        password: (req, res) => {
            const { id } = req.params;
            const { password } = req.body;

            bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
                if(err) {
                    res.status(501).send(err);
                    return;
                }
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) {
                        res.status(501).send(err);
                    }
                    else {
                        User.update({
                            password: hash,
                        }, {
                            where: { id }
                        })
                            .then(() => {
                                res.status(200).json({
                                    message: PASSWORD_UPDATED
                                });
                            })
                            .catch(err => {
                                res.status(501).json(err);
                            });
                    }
                });
            });
        }
    },
    delete: {
        user: (req, res) => {
            const { id } = req.params;

            User.destroy({ where: { id } })
                .then(data => {
                    if(!data) 
                        throw {
                            message: USER_NOT_FOUND
                        }
                    res.status(200).json({
                        message: USER_DELETED
                    })
                })
                .catch(err => {
                    res.status(501).send(err);
                })
        }
    }
}

