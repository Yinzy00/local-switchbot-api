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
    log('Initializing Database...');
    //Create switchbot device table if it doesn't exist
    const sql = `CREATE TABLE IF NOT EXISTS tbSwitchBotDevices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        switchbot_id VARCHAR(255) NOT NULL);`;
    sendQuery(sql, () => {
        log('Switchbot device table created if didn\'t exist');
    });

}

//get custom name of device
const getCustomName = (id) => {
    const sql = `SELECT name FROM tbSwitchBotDevices WHERE switchbot_id = '${id}'`;
    return new Promise((resolve, reject) => {
        sendQuery(sql, (result) => {
            if (result.length > 0) {
                resolve(result[0].name);
            } else {
                resolve(null);
            }
        });
    }
    );
}

//Get id of device by custom name
const getIdByCustomName = (name) => {
    const sql = `SELECT switchbot_id FROM tbSwitchBotDevices WHERE name = '${name}'`;
    return new Promise((resolve, reject) => {
        sendQuery(sql, (result) => {
            if (result.length > 0) {
                resolve(result[0].switchbot_id);
            } else {
                resolve(null);
            }
        });
    }
    );
}

//Add custom name for device
const addCustomName = (id, name) => {
    const sql = `INSERT INTO tbSwitchBotDevices (name, switchbot_id) VALUES ('${name}', '${id}');`;
    sendQuery(sql, () => {
        log(`Custom name ${name} added to device ${id}`);
    });
}

//Update custom name of device if exists else add new custom name for device
const updateCustomName = (id, name) => {
    const sql = `SELECT * FROM tbSwitchBotDevices WHERE switchbot_id = '${id}';`;
    sendQuery(sql, (result) => {
        if (result.length > 0) {
            const sql = `UPDATE tbSwitchBotDevices SET name = '${name}' WHERE switchbot_id = '${id}';`;
            sendQuery(sql, () => {
                log(`Custom name ${name} updated for device ${id}`);
            }
            );
        } else {
            addCustomName(id, name);
        }
    }
    );
}

//Delete custom name of device
const deleteCustomName = (id) => {
    const sql = `DELETE FROM tbSwitchBotDevices WHERE switchbot_id = '${id}';`;
    sendQuery(sql, () => {
        log(`Custom name deleted for device ${id}`);
    }
    );
}

module.exports = { database, sendQuery, InitDatabase, getCustomName, getIdByCustomName, updateCustomName, deleteCustomName };