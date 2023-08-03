const jwt = require('jsonwebtoken');
const { secret } = require('../config');

function createToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1h' });
}

function verifyToken(token) {
    const decodedToken = jwt.verify(token, secret);
    return decodedToken;
}

module.exports = {
    createToken,
    verifyToken
}
