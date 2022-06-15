require('dotenv').config();
const { updateCustomName } = require('./database');
const log = require('./log');
const Log = require('./log');
const sleep = require('./sleep');
const { switchBotDevices } = require('./switchbot');

const express = require('express'),
    app = express();

//Root
app.get('/', (req, res) => {
    res.send('succes');
    Log("/ Route called.");
});

//Get list of devices
app.get('/devices', async (req, res) => {
    const returnData = [];
    for (let i = 0; i < switchBotDevices.length; i++) {
        const device = switchBotDevices[i];
        let customName = device.customName;
        returnData.push({
            id: device.id,
            type: device.constructor.name,
            customName: customName
        });
    }
    res.send(JSON.stringify(returnData));
    Log("/devices Route called.");
});

//Get device by id
app.get('/devices/id/:id', (req, res) => {
    const deviceToUse = switchBotDevices.find(d => d.id === req.params.id);
    if (deviceToUse !== undefined) {
        res.send(JSON.stringify({
            id: deviceToUse.id,
            type: deviceToUse.constructor.name,
            customName: deviceToUse.customName
        }));
    } else {
        res.sendStatus(404);
    }
    Log("/devices/id/:id Route called.");
});

//Set device name
app.get('/devices/id/:id/setName/:name', async (req, res) => {
    if (process.env.USE_MYSQL === "true") {
        await updateCustomName(req.params.id, req.params.name);
        res.send(`Custom name ${req.params.name} set for device ${req.params.id}`);
        Log("/devices/id/:id/setName/:name Route called.");
    }
    else {
        res.send("Mysql is not enabled");
    }
});

//Get device by name
app.get('/devices/name/:name', (req, res) => {
    if (process.env.USE_MYSQL === "true") {
        // const id = await getIdByCustomName(req.params.name);
        const id = switchBotDevices.find(d => d.customName === req.params.name).id;
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
    else {
        res.send("Mysql is not enabled");
    }

    Log("/devices/name/:name Route called.");
});

//Open curtain
app.get('/devices/id/:id/open', (req, res) => {
    const deviceToUse = switchBotDevices.find(d => d.id === req.params.id);
    if (deviceToUse !== undefined) {
        deviceToUse.open()
            .catch(err => {
                //Prevent the error from stopping the server
            })
            .finally(() => {
                res.send(`Device ${req.params.id} opening...`);
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
        deviceToUse.close()
            .catch(err => {
                //Prevent the error from stopping the server
                // Log(err);
                // res.sendStatus(500);
            })
            .finally(() => {
                res.send(`Device ${req.params.id} closing...`);
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
    Log("/devices/id/:id/runToPos/:position Route called.");
});

//Pause curtain
app.get('/devices/id/:id/pause', (req, res) => {
    const deviceToUse = switchBotDevices.find(d => d.id === req.params.id);
    if (deviceToUse !== undefined) {
        deviceToUse.pause()
            .catch(err => {
                //Prevent the error from stopping the server
            })
            .finally(() => {
                res.send(`Device ${req.params.id} paused...`);
                log(`Device ${req.params.id} paused...`);
            });
    }
    else {
        res.sendStatus(404);
    }
    Log("/devices/id/:id/pause Route called.");
});

module.exports = app;