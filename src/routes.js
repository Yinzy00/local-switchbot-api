require('dotenv').config();
const { getCustomName, updateCustomName, getIdByCustomName } = require('./database');
const log = require('./log');
const Log = require('./log');
const sleep = require('./sleep');
const { switchBotDevices } = require('./switchbot');

const express = require('express'),
    app = express();

//Root
app.get('/', (req, res) => {
    res.send('Hello World!');
    Log("/ Route called.");
});

//Get list of devices
app.get('/devices', (req, res) => {
    res.send(JSON.stringify(switchBotDevices.map(d => {
        return {
            id: d.id,
            type: d.constructor.name,
            customName: getCustomName(d.id)
        }
    })));
    Log("/devices Route called.");
});

//Get device by id
app.get('/devices/id/:id', async (req, res) => {
    const deviceToUse = switchBotDevices.find(d => d.id === req.params.id);
    if (deviceToUse !== undefined) {
        res.send(JSON.stringify({
            id: deviceToUse.id,
            type: deviceToUse.constructor.name,
            customName: await getCustomName(deviceToUse.id)
        }));
    } else {
        res.sendStatus(404);
    }
    Log("/devices/id/:id Route called.");
});

//Set device name
app.get('/devices/id/:id/setName/:name', (req, res) => {
    if(process.env.USE_MYSQL === "true"){
        updateCustomName(req.params.id, req.params.name);
        res.send(`Custom name ${req.params.name} set for device ${req.params.id}`);
        Log("/devices/id/:id/setName/:name Route called.");
    }
    else{
        res.send("Mysql is not enabled");
    }
});

//Get device by name
app.get('/devices/name/:name', async (req, res) => {
    if(process.env.USE_MYSQL === "true"){
        const id = await getIdByCustomName(req.params.name);
    if (id !== null) {
        const deviceToUse = switchBotDevices.find(d => d.id === id);
        if (deviceToUse !== undefined) {
            res.send(JSON.stringify({
                id: deviceToUse.id,
                type: deviceToUse.constructor.name,
                customName: req.params.name
            }));
        }
        else {
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(404);
    }
    }
    else{
        res.send("Mysql is not enabled");
    }

    Log("/devices/name/:name Route called.");
});

//Open curtain
app.get('/devices/id/:id/open', (req, res) => {
    const deviceToUse = switchBotDevices.find(d => d.id === req.params.id);
    if (deviceToUse !== undefined) {
        deviceToUse.open().then(() => {
        res.send(`Device ${req.params.id} opening...`);
        })
        .catch(err => {
            //Prevent the error from stopping the server
            Log(err);
            res.sendStatus(500);
        });
    }
    else {
        res.sendStatus(404);
    }
    Log("/devices/id/:id/open Route called.");
});

//Close curtain
app.get('/devices/id/:id/close', (req, res) => {
    const deviceToUse = switchBotDevices.find(d => d.id === req.params.id);
    if (deviceToUse !== undefined) {
        deviceToUse.close().then(() => {
            res.send(`Device ${req.params.id} closing...`);
        }
        ).catch(err => {
            //Prevent the error from stopping the server
            Log(err);
            res.sendStatus(500);
        });
    }
    else {
        res.sendStatus(404);
    }
    Log("/devices/id/:id/close Route called.");
});

//Set curtain position 
app.get('/devices/id/:id/runToPos/:position', async (req, res) => {
    const deviceToUse = switchBotDevices.find(d => d.id === req.params.id);
    const percent = parseInt(req.params.position);
    const done = false;
    if (Number.isInteger(percent)) {
        if (deviceToUse !== undefined) {
            deviceToUse.runToPos(percent)
                .catch((error) => {
                    //Prevent the error from stopping the server
                })
                .finally(() => {
                    res.send(`Device ${req.params.id} running to position ${req.params.position}...`);
                    log(`Device ${req.params.id} running to position ${req.params.position}...`);
                });
        }
        else {
            res.sendStatus(404);
        }
    }
    else {
        res.send(`Invalid position ${req.params.position}`);
    }
    Log("/devices/id/:id/setPosition/:position Route called.");
});

module.exports = app;