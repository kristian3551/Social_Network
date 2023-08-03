const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
    config.dbConfig.database,
    config.dbConfig.username,
    config.dbConfig.password, 
    config.dbConfig.options
);

sequelize.authenticate()
.then(() => {
    console.log('Successfully connected to database!')
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
        console.log('Successfully syncronized with database!');
    });

module.exports = db;
