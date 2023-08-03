const { User, Friendship } = require('../db');
const { Op } = require("sequelize");

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
                    const listOfUsernames = users.map(user => user.username);

                    return Promise.all([
                        Friendship.findAll({
                            where: {
                                username: {
                                    [Op.in]: listOfUsernames
                                }
                            }
                        }),
                        users
                    ]);
                })
                .then(([friendships, users]) => {
                       friendships = friendships.map(friendship => friendship.toJSON());

                    users.forEach(user => {
                        user.list_of_friends = friendships.filter(friendship => friendship.username == user.username)
                            .map(friendship => friendship.friend_username);
                    });

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
        user: (req, res) => {
            const { id } = req.params;
            
            User.findOne({ where: { id } })
                .then(data => {
                    if(!data)
                        throw {
                            status: 404,
                            message: USER_NOT_FOUND
                        }

                    const user = data.toJSON();

                    return Promise.all([
                        User.destroy({ where: { id } }),
                        Friendship.destroy({ where: {
                            [Op.or]: [
                                { username: user.username },
                                { friend_username: user.username }
                            ]
                        }})
                    ]);
                })
                .then(() => {
                    res.status(200).json({
                        message: USER_DELETED
                    });
                })
                .catch(err => {
                    res.status(err.status || 500).send(err);
                })
        }
    }
}

