const { User } = require('../db');

const { PAGE_NOT_PASSED,
    USER_CREATED,
    PASSWORD_UPDATED,
    USER_NOT_FOUND,
    USER_DELETED
} = require('../utils/messages');

const bcrypt = require('bcrypt');
const { saltRounds } = require('../config');

const MAX_PER_PAGE = 5;

module.exports = {
    get: {
        users: (req, res) => {
            const { page } = req.query;
            if(!page) {
                res.status(404).json({
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
                    res.status(500).send(err);
                });
        }
    },
    post: {
        user: (req, res) => {
            const { username, email, password, role } = req.body;

            bcrypt.genSalt(saltRounds, (err, salt) => {
                if(err) {
                    res.status(500).send(err);
                    return;
                }
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) {
                        res.status(500).send(err);
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
                                res.status(500).send(err);
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

            bcrypt.genSalt(saltRounds, (err, salt) => {
                if(err) {
                    res.status(500).send(err);
                    return;
                }
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) {
                        res.status(500).send(err);
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
                                res.status(500).json(err);
                            });
                    }
                });
            });
        }
    },
    delete: {
        user: async (req, res) => {
            const { id } = req.params;

            Promise.all([
                User.findAll(),
                User.findOne({ where: { id } })
            ])
                .then(async ([data, userToBeDeleted]) => {
                    userToBeDeleted = userToBeDeleted.toJSON();

                    data.forEach(async (rawUser) => {
                        const user = rawUser.toJSON();

                        if(user.list_of_friends.includes(userToBeDeleted.username)) {
                            user.list_of_friends = user.list_of_friends
                                .filter(el => el != userToBeDeleted.username);

                            await User.update({
                                list_of_friends: user.list_of_friends
                            }, { where: { id: user.id } });
                        }
                    });

                    return User.destroy({ where: { id } });
                })
                .then(data => {
                    if(!data) throw {
                            message: USER_NOT_FOUND
                        }

                    res.status(200).json({
                        message: USER_DELETED
                    });
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        }
    }
}

