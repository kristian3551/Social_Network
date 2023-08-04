const UserService = require('../services/UserService');
const FriendshipService = require('../services/FriendshipService');

const { PAGE_NOT_PASSED,
    USER_CREATED,
    PASSWORD_UPDATED,
    USER_NOT_FOUND,
    USER_DELETED
} = require('../utils/messages');

const bcrypt = require('bcrypt');
const { saltRounds } = require('../config');

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

            UserService.getAll(page)
                .then(data => {
                    const users = data.map(rawUser => rawUser.toJSON());
                    const listOfUsernames = users.map(user => user.username);

                    return Promise.all([
                        FriendshipService.findAllFriendshipsForUsers(listOfUsernames),
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
                        UserService.createUser(username, hash, role, email)
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
                        UserService.updatePasswordById(id, hash)
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
            
            UserService.getById(id)
                .then(data => {
                    if(!data)
                        throw {
                            status: 404,
                            message: USER_NOT_FOUND
                        }

                    const user = data.toJSON();

                    return Promise.all([
                        UserService.deleteById(id),
                        FriendshipService.deleteAllByUsername(user.username)
                    ]);
                })
                .then(() => {
                    res.status(200).json({
                        message: USER_DELETED
                    });
                })
                .catch(err => {
                    res.status(err.status || 500).send(err);
                });
        }
    }
}

