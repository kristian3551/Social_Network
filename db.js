const { Sequelize } = require('sequelize');
const config = require('./config');

const { 
    CONNECTED_TO_DB,
    SYNC_WITH_DB    
} = require('./utils/messages');

const sequelize = new Sequelize(
    config.dbConfig.database,
    config.dbConfig.username,
    config.dbConfig.password, 
    config.dbConfig.options
);

sequelize.authenticate()
    .then(() => {
        console.log(CONNECTED_TO_DB);
    })
    .catch(err => {
        console.log('Error: ', err);
    });

const db = {
    TokenBlacklist: require('./models/tokenBlacklist')(sequelize),
    User: require('./models/user')(sequelize),
};

sequelize.sync({ force: false })
    .then(() => {
        console.log(SYNC_WITH_DB);
    });

module.exports = db;
