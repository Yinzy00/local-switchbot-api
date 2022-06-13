const noble = require('@abandonware/noble');
const Switchbot = require('node-switchbot');
const sleep = require('./sleep');
const switchBotDevices = [];
const sb = new Switchbot({
    noble: noble,
});
const log = require('./log');

const InitSwitchBot = async () => {
    log('Initializing SwitchBot...');
    await searchDevices();
    log(`${switchBotDevices.length} devices found.`);
}

//Scan for devices (takes 10 seconds)
const searchDevices = async () => {
    var attempt = 0;
    log('Searching for switchbot devices (+- 10 seconds)');
    sb.ondiscover = (device) => {
        if (switchBotDevices.find(d => d.id === device.id) === undefined) {
            log(`Found device: ${device.id}`);
            switchBotDevices.push(device);
        }
    }
    while (attempt < 10) {
        await sb.discover({
            quick: false,
            duration: 1000
        });
        attempt++;
        await sleep(100);
    }
    log('Searching for switchbot devices finished.');
}

module.exports = { InitSwitchBot, switchBotDevices };