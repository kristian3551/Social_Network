const { User, Friendship } = require('../db');

const bcrypt = require('bcrypt');
const { saltRounds, domain, staticDirname } = require('../config');


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
    REMOVED_FRIEND,
    FILE_TOO_BIG,
    AVATAR_ADDED,
    FILE_NOT_PROVIDED
} = require('../utils/messages');

const MAX_FRIENDS_COUNT = 1000;
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

module.exports = {
    get: {
        myInfo: (req, res) => {
            const id = req.userId;

            User.findOne({ where: { id } })
                .then(data => {
                    const user = data.toJSON();

                    return Promise.all([
                        Friendship.findAll({ 
                            attributes: ['friend_username'], 
                            where: { username: user.username } 
                        }),
                        user
                    ]);
                })
                .then(([data, user]) => {
                    data = data.map(el => el.toJSON().friend_username);
                    user.list_of_friends = data;
                    res.status(200).json(user);
                });
        }
    },
    post: {
        addFriend: (req, res) => {
            const id = req.userId;
            const { friendUsername } = req.body;

            User.findOne({ where: { username: friendUsername } })
                .then(data => {
                    if(!data)
                        throw {
                            status: 404,
                            message: USER_NOT_FOUND
                        }
                    if(data.toJSON().role == 0)
                        throw {
                            status: 401,
                            message: USER_NOT_END_USER
                        }

                    return User.findOne({ where: { id } });
                })
                .then(data => {
                    if(!data)
                        throw {
                            status: 404,
                            message: USER_NOT_FOUND
                        }

                    const user = data.toJSON();

                    return Promise.all([
                        Friendship.findOne({ 
                            where: { 
                                username: user.username, 
                                friend_username: friendUsername 
                            }
                        }),
                        user
                    ]);
                })
                .then(([data, user]) => {
                    if(data)
                        throw {
                            status: 422,
                            message: ALREADY_FRIENDS
                        }
                    
                    return Promise.all([
                        Friendship.findAll({ 
                            where: { 
                                username: user.username 
                            }
                        }),
                        user
                    ]);
                })
                .then(([data, user]) => {
                    if(data.length >= MAX_FRIENDS_COUNT)
                        throw {
                            status: 422,
                            message: FRIENDS_LIMIT_REACHED
                        }

                    return Friendship.create({ username: user.username, friend_username: friendUsername });
                })
                .then(() => {
                    res.status(200).json({
                        message: ADDED_FRIEND
                    });
                })
                .catch(err => {
                    res.status(err.status || 500).send(err);
                });
        },
        avatar: (req, res) => {
            const id = req.userId;
            const file = req.file;

            if(!file) {
                res.status(400).send({
                    message: FILE_NOT_PROVIDED
                });

                return;
            }

            if(file.size > MAX_AVATAR_SIZE) {
                res.status(400).send({
                    message: FILE_TOO_BIG
                });

                return;
            }
            
            const path = domain + file.path.split(staticDirname)[1];

            User.update({ avatar: path }, { where: { id } })
                .then(() => {
                    res.status(200).json({
                        message: AVATAR_ADDED
                    });
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        }
    },
    patch: {
        username: (req, res) => {
            const id = req.userId;
            const { username } = req.body;

            User.findOne({ where: { id } })
                .then(data => {
                    if(!data)
                        throw {
                            status: 404,
                            message: USER_NOT_FOUND
                        }

                    const user = data.toJSON();

                    return Promise.all([
                        User.update({ username }, { where: { id } }),
                        Friendship.update({ username }, { where: { username: user.username } }),
                        Friendship.update({ friend_username: username }, { where: { friend_username: user.username }})
                    ]);
                })
                .then(() => {
                    res.status(200).json({
                        message: USERNAME_UPDATED
                    });
                })
                .catch(err => {
                    res.status(err.status || 500).send(err);
                });
        },
        email: (req, res) => {
            const id = req.userId;
            const { email } = req.body;

            User.update({ email }, { where: { id } })
                .then(data => {
                    if(!data)
                        throw {
                            status: 404,
                            message: USER_NOT_FOUND
                        }

                    res.status(200).json({
                        message: EMAIL_UPDATED
                    });
                })
                .catch(err => {
                    res.status(err.status || 500).send(err);
                });
        },
        password: (req, res) => {
            const id = req.userId;
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
        removeFriend: (req, res) => {
            const id = req.userId;
            const { friendUsername } = req.body;

            User.findOne({ where: { username: friendUsername } })
                .then(data => {
                    if(!data)
                        throw {
                            status: 404,
                            message: USER_NOT_FOUND
                        }
                    if(data.toJSON().role == 0)
                        throw {
                            status: 401,
                            message: USER_NOT_END_USER
                        }

                    return User.findOne({ where: { id } });
                })
                .then(data => {
                    if(!data)
                        throw {
                            status: 404,
                            message: USER_NOT_FOUND
                        }

                    const user = data.toJSON();

                    return Promise.all([
                        Friendship.findOne({ 
                            where: { 
                                username: user.username, 
                                friend_username: friendUsername 
                            }
                        }),
                        user
                    ]);
                })
                .then(([data, user]) => {
                    if(!data)
                        throw {
                            message: USERS_NOT_FRIENDS
                        }

                    return Friendship.destroy({
                        where: {
                            username: user.username,
                            friend_username: friendUsername
                        }
                    });
                })
                .then(() => {
                    res.status(200).json({
                        message: REMOVED_FRIEND
                    });
                })
                .catch(err => {
                    res.status(err.status || 500).send(err);
                });
        }
    }
}
