const { TokenBlacklist } = require('../db');

class TokenBlacklistService {
    static addToken(token) {
        return TokenBlacklist.create({ token });
    }

    static find(token) {
        return TokenBlacklist.findOne({ where: { token } });
    }
}

module.exports = TokenBlacklistService;
