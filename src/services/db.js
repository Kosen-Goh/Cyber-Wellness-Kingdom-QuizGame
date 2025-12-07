require('dotenv').config(); //read .env file and set environment variables

const mysql = require('mysql2');

// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER); // This should print "root"
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // Should print "BED-SQL"
// console.log("DB_DATABASE:", process.env.DB_DATABASE); // Should print "CA1Test"


// const setting = {
//     connectionLimit : 10, //set limit to 10 connection
//     host     : process.env.DB_HOST, //get host from environment variable
//     user     : process.env.DB_USER, //get user from environment variable
//     password : process.env.DB_PASSWORD, //get password from environment variable
//     database : process.env.DB_DATABASE, //get database from environment variable
//     multipleStatements: true, //allow multiple sql statements
//     dateStrings: true, //return date as string instead of Date object
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     ssl: {
//         rejectUnauthorized: true
//     }
//     }

// const pool = mysql.createPool(setting);

// module.exports = pool;

// after create pool, export , other modules can be use like pokedex and pokemon models
// they will use this pool to do all the query they need
/////////////////////////////////////////////////////////////////////////////////////////
// DB connection settings
const pool = mysql.createPool({
    host: process.env.DB_HOST,           // Aiven host
    user: process.env.DB_USER,           // Aiven user
    password: process.env.DB_PASSWORD,   // Aiven password
    database: process.env.DB_DATABASE,   // Aiven database
    port: process.env.DB_PORT,           // Aiven port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    dateStrings: true,
    connectTimeout: 20000,               // 20s timeout to prevent ETIMEDOUT
    ssl: { rejectUnauthorized: false }    // SSL required by Aiven, false will allow self-signed cert
});

module.exports = pool;