require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const log = require('./log');
const { initDatabase } = require('./database');
const { initSwitchBot, startMonitoringAdvertisingPackets } = require('./switchbot');

//Setup express server
app.use(express.json());
app.use(routes);

const init = async () => {
    log('Initializing...');
    await initSwitchBot();
    //init functionalitites
    if (process.env.USE_MYSQL === "true") {
        await initDatabase();
    }
    //Start monitoring switchbot packets
    startMonitoringAdvertisingPackets();
}

init().then(() => {
    log('Initialized');
    //Start server
    app.listen(process.env.SERVER_PORT, () => {
        log(`Server is running on port ${process.env.SERVER_PORT}`);
    });
}).catch(err => {
    log(err);
});