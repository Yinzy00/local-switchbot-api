const log = require('./log');
const mysql = require('mysql');
const { switchBotDevices } = require('./switchbot');
const sleep = require('./sleep');
require('dotenv').config();

const database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const sendQuery = async (sql, callback) => {

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
    //wait for query to finish
    await sleep(500);
}

//Setup database
const initDatabase = async () => {
    log('Initializing Database...');
    //Create switchbot device table if it doesn't exist
    const sql = `CREATE TABLE IF NOT EXISTS tbSwitchBotDevices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        switchbot_id VARCHAR(255) NOT NULL);`;
    await sendQuery(sql, () => {
        log('Switchbot device table created if didn\'t exist');
    });
    //Wait for tb to be created if nessessary
    await loadCustomNames();
}

// //get custom name of device
// const getCustomName = (id) => {
//     const sql = `SELECT name FROM tbSwitchBotDevices WHERE switchbot_id = '${id}'`;
//     return new Promise((resolve, reject) => {
//         sendQuery(sql, (result) => {
//             if (result.length > 0) {
//                 resolve(result[0].name);
//             } else {
//                 resolve(null);
//             }
//         });
//     }
//     );
// }

//Get id of device by custom name
// const getIdByCustomName = (name) => {
//     const sql = `SELECT switchbot_id FROM tbSwitchBotDevices WHERE name = '${name}'`;
//     return new Promise((resolve, reject) => {
//         sendQuery(sql, (result) => {
//             if (result.length > 0) {
//                 resolve(result[0].switchbot_id);
//             } else {
//                 resolve(null);
//             }
//         });
//     }
//     );
// }

//Add custom name for device
const addCustomName = async (id, name) => {
    const sql = `INSERT INTO tbSwitchBotDevices (name, switchbot_id) VALUES ('${name}', '${id}');`;
    await sendQuery(sql, () => {
        log(`Custom name ${name} added to device ${id}`);
    });
}

//Update custom name of device if exists else add new custom name for device
const updateCustomName = async (id, name) => {
    const sql = `SELECT * FROM tbSwitchBotDevices WHERE switchbot_id = '${id}';`;
    await sendQuery(sql, async (result) => {
        if (result.length > 0) {
            const sql = `UPDATE tbSwitchBotDevices SET name = '${name}' WHERE switchbot_id = '${id}';`;
            await sendQuery(sql, () => {
                log(`Custom name ${name} updated for device ${id}`);
            }
            );
        } else {
            await addCustomName(id, name);
        }
    }
    );
}

//Delete custom name of device
const deleteCustomName = async (id) => {
    const sql = `DELETE FROM tbSwitchBotDevices WHERE switchbot_id = '${id}';`;
    await sendQuery(sql, () => {
        log(`Custom name deleted for device ${id}`);
    }
    );
}

//load all custom names from database into device objects
const loadCustomNames = async () => {
    log('Loading custom names...');
    const sql = `SELECT * FROM tbSwitchBotDevices`;
    await sendQuery(sql, (result) => {
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const device = switchBotDevices.find(d => d.id === result[i].switchbot_id);
                if (device) {
                    device.customName = result[i].name;
                }
            }
        }
    });
    log('Custom names loaded');
}

module.exports = { database, sendQuery, initDatabase, updateCustomName, deleteCustomName, loadCustomNames };