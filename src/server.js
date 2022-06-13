require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const log = require('./log');
const { InitDatabase } = require('./database');

//Setup express server
app.use(express.json());
app.use(routes);

//Create tables if don't exist
InitDatabase();

//Start server
app.listen(process.env.SERVER_PORT, () => {
    log(`Server is running on port ${process.env.SERVER_PORT}`);
});