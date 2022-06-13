const log = require('./log');
const mysql = require('mysql');
require('dotenv').config();

const database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const sendQuery = (sql, callback) => {

    //Connect to db
    database.getConnection((err, connection) => {
        if (err) throw err;
        //Run query
        connection.query(sql, (err, result) => {
            connection.release();
            if (err) throw err;
            log('Query executed');
            callback(result);
        });

    });
}

//Setup database
const InitDatabase = () => {

    //Create switchbot device table if it doesn't exist
    const sql = `CREATE TABLE IF NOT EXISTS tbSwitchBotDevices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        switchbot_id VARCHAR(255) NOT NULL);`;
    sendQuery(sql, () => {
        log('Switchbot device table created');
    });
    
}


module.exports = { database, sendQuery, InitDatabase };