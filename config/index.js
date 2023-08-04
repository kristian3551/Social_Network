module.exports = {
    port: process.env.PORT,
    domain: `http://localhost:${process.env.PORT}`,
    staticDirname: 'uploads',
    dbConfig: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        options: {
            host: process.env.DB_HOST,
            dialect: 'postgres'
        }
    },
    secret: process.env.SECRET,
    authCookieName: 'x-auth-token',
    saltRounds: 10
};
