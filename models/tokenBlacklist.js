const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TokenBlacklist = sequelize.define("blacklist", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING(400),
            allowNull: false
        }
    }, {
        tableName: "token_blacklist",
        timestamps: false
    });

    return TokenBlacklist;
}
