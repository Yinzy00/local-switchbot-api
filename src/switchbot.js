const noble = require('@abandonware/noble');
const Switchbot = require('node-switchbot');
const sleep = require('./sleep');
const switchBotDevices = [];
const sb = new Switchbot({
    noble: noble,
});
const log = require('./log');

const initSwitchBot = async () => {
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
            device.stateBeingChanged = false;
            device.state = null;
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

//Create 5 test objects using the strucutre below and counter ++ for each object and id is 1 or 2 randomly



const startMonitoringAdvertisingPackets = async () => {

    await sb.startScan();

    var counter = 0;

    sb.onadvertisement = (ad) => {
        ad.counter = counter;
        handlePacket(ad);
        counter++;
    }

    await sb.wait(1000);

    sb.stopScan();

    await sleep(1000);
    //Repeat
    startMonitoringAdvertisingPackets();
}

const handlePacket = async (packet) => {
    //Find wich device the packet belongs to
    const device = switchBotDevices.find(d => d.id === packet.id);
    //If device is found
    if (device) {
        if (!device.stateBeingChanged) {
            device.stateBeingChanged = true;
            await setDeviceState(device, packet);
            device.stateBeingChanged = false;
        }
    }
}

const setDeviceState = async (device, packet) => {
    if (packet.serviceData.modelName === 'WoCurtain') {
        const newState = {
            position: packet.serviceData.position,
            battery: packet.serviceData.battery,
            lightLevel: packet.serviceData.lightLevel
        };
        //If device is not already in the correct state
        if (JSON.stringify(device.state) != JSON.stringify(newState)) {
            //Update device state
            device.state = newState;
            log(`${device.customName ? device.customName : device.id} position: ${device.state.position} battery: ${device.state.battery} lightLevel: ${device.state.lightLevel}`);
        }
    }
    else {
        log('Unknown device model: ' + packet.modelName);
    }
}

module.exports = { initSwitchBot, switchBotDevices, startMonitoringAdvertisingPackets };