require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const log = require('./log');
const { InitDatabase } = require('./database');
const { InitSwitchBot } = require('./switchbot');

//Setup express server
app.use(express.json());
app.use(routes);

//init functionalitites
InitDatabase();
InitSwitchBot();

//Start server
app.listen(process.env.SERVER_PORT, () => {
    log(`Server is running on port ${process.env.SERVER_PORT}`);
});