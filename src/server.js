require('dotenv').config();
const express = require('express'),
    app = express(),
    routes = require('./routes'),
    log = require('./log');


app.use(express.json());
app.use(routes);


app.listen(process.env.SERVER_PORT, () => {
    log(`Server is running on port ${process.env.SERVER_PORT}`);
});