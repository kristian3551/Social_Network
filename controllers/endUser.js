const { User } = require('../db');

const bcrypt = require('bcrypt');
const { saltRounds } = require('../config');


const {
    USER_NOT_FOUND,
    FRIENDS_LIMIT_REACHED,
    ALREADY_FRIENDS,
    ADDED_FRIEND,
    USERNAME_UPDATED,
    PASSWORD_UPDATED,
    EMAIL_UPDATED,
    USER_NOT_END_USER,
    USERS_NOT_FRIENDS,
    REMOVED_FRIEND
} = require('../utils/messages');

const MAX_FRIENDS_COUNT = 1000;

module.exports = {
    get: {
        myInfo: (req, res) => {
            const id = req.userId;

            User.findOne({ where: { id } })
                .then(data => {
                    res.status(200).json(data.toJSON());
                })
                .catch(err => {
                    res.status(501).send(err);
                });
        }
    },
    post: {
        addFriend: (req, res) => {
            const id = req.userId;
            const { friendId } = req.body;

            User.findOne({ where: { id: friendId } })
                .then(data => {
                    if(!data)
                        throw {
                            message: USER_NOT_FOUND
                        }
                    if(data.toJSON().role == 0)
                        throw {
                            message: USER_NOT_END_USER
                        }

                    return User.findOne({ where: { id } });
                })
                .then(data => {
                    if(!data)
                        throw {
                            message: USER_NOT_FOUND
                        }

                    const user = data.toJSON();

                    if(user.list_of_friends.length >= MAX_FRIENDS_COUNT)
                        throw {
                            message: FRIENDS_LIMIT_REACHED
                        }

                    if(user.list_of_friends.includes(`${friendId}`))
                        throw {
                            message: ALREADY_FRIENDS
                        }

                    user.list_of_friends.push(`${friendId}`);

                    return User.update({ 
                        list_of_friends: user.list_of_friends
                    }, { where: { id } });
                })
                .then(() => {
                    res.status(200).json({
                        message: ADDED_FRIEND
                    })
                })
                .catch(err => {
                    res.status(501).send(err);
                });
        }
    },
    patch: {
        username: (req, res) => {
            const id = req.userId;
            const { username } = req.body;

            User.update({ username }, { where: { id } })
                .then(data => {
                    if(!data)
                        throw {
                            message: USER_NOT_FOUND
                        }

                    res.status(200).json({
                        message: USERNAME_UPDATED
                    });
                })
                .catch(err => {
                    res.status(501).send(err);
                });
        },
        email: (req, res) => {
            const id = req.userId;
            const { email } = req.body;

            User.update({ email }, { where: { id } })
                .then(data => {
                    if(!data)
                        throw {
                            message: USER_NOT_FOUND
                        }

                    res.status(200).json({
                        message: EMAIL_UPDATED
                    });
                })
                .catch(err => {
                    res.status(501).send(err);
                });
        },
        password: (req, res) => {
            const id = req.userId;
            const { password } = req.body;

            bcrypt.genSalt(saltRounds, (err, salt) => {
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
        removeFriend: (req, res) => {
            const id = req.userId;
            const { friendId } = req.body;

            User.findOne({ where: { id: friendId } })
                .then(data => {
                    if(!data)
                        throw {
                            message: USER_NOT_FOUND
                        }
                    if(data.toJSON().role == 0)
                        throw {
                            message: USER_NOT_END_USER
                        }

                    return User.findOne({ where: { id } });
                })
                .then(data => {
                    if(!data)
                        throw {
                            message: USER_NOT_FOUND
                        }

                    const user = data.toJSON();

                    if(!user.list_of_friends.includes(`${friendId}`))
                        throw {
                            message: USERS_NOT_FRIENDS
                        }

                    user.list_of_friends = user.list_of_friends.filter(friend => friend != `${friendId}`);

                    return User.update({ 
                        list_of_friends: user.list_of_friends
                    }, { where: { id } });
                })
                .then(() => {
                    res.status(200).json({
                        message: REMOVED_FRIEND
                    })
                })
                .catch(err => {
                    res.status(501).send(err);
                });
        }
    }
}
