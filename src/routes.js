const Log = require('./log');

const express = require('express'),
    app = express();

//Root
app.get('/', (req, res) => {
    res.send('Hello World!');
    Log("/ Route called.");
});

//Get list of devices
app.get('/devices', (req, res) => {
    res.send('Hello Devices!');
    Log("/devices Route called.");
});

//Get device by id
app.get('/devices/:id', (req, res) => {
    res.send('Hello Devices!');
    Log("/devices/:id Route called.");
});

//Set device name
app.get('/devices/:id/setName/:name', (req, res) => {
    res.send('Hello Devices!');
    Log("/devices/:id/setName/:name Route called.");
});

//Get device by name
app.get('/devices/:name', (req, res) => {
    res.send('Hello Devices!');
    Log("/devices/:name Route called.");
});

//Open curtain
app.get('/device/:id/open', (req, res) => {
    res.send('Hello Devices!');
    Log("/device/:id/open Route called.");
});

//Close curtain
app.get('/device/:id/close', (req, res) => {
    res.send('Hello Devices!');
    Log("/device/:id/close Route called.");
});

//Set curtain position 
app.get('/device/:id/setPosition/:position', (req, res) => {
    res.send('Hello Devices!');
    Log("/device/:id/setPosition/:position Route called.");
});

module.exports = app;