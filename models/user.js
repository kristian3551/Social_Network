const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        list_of_friends: {
            type: DataTypes.ARRAY,
            defaultValue: []
        }
    }, {
        tableName: "users",
        timestamps: false
    });

    return User;
}
