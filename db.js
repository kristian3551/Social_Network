const { Sequelize } = require('sequelize');
const config = require('./config');
const bcrypt = require('bcrypt');

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
    Friendship: require('./models/friendships')(sequelize)
};

sequelize.sync({ force: false })
    .then(() => {
        console.log(SYNC_WITH_DB);
        return db.User.findOne({ where: { username: 'admin'} });
    })
    .then(data => {
        if(!data) {
            bcrypt.genSalt(config.saltRounds, (err, salt) => {
                if(err) {
                    console.log(err);
                    return;
                }
                bcrypt.hash(process.env.ADMIN_PASSWORD, salt, (err, hash) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    else {
                        db.User.create({
                            username: 'admin', 
                            password: hash,
                            email: 'admin@admin.com',
                            role: 0
                        })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                });
            });
        }
    })
    .catch(err => {
        console.log(err);
    });

module.exports = db;
