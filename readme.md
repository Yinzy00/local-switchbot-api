# Local Switchbot Api

My Node.js local switchbot api project to prevent using their cloud based open API. No longer dependent on an internet connection or switchbot servers.

Project created using [node-switchbot](https://www.npmjs.com/package/node-switchbot) package.

To use the project you need:
- Linux device
- BTE compatible adapter

## Currently suupported
- [Switchbot Curtain](https://www.switch-bot.com/products/switchbot-curtain)
    - Open
    - Close
    - runToPos

## Custom device names
Turn on by adding env prop (USE_MYSQL = "true") to .env file

## Routes

** /devices **
Returns list of all found devices.

** /devices/id/:id **
Returns device by device id

** /devices/id/:id/setName/:name **
Sets custom device name (use_mysql required!)

** /devices/name/:name **
Returns device by custom name (use_mysql required!)

** /devices/id/:id/open **
Open curtain by device id

** /devices/id/:id/close **
Close curtain by device id

** /devices/id/:id/runToPos/:position **
Set curtain position by device id

## Installation
### Installing required bluetooth library
##### Ubuntu, Debian, Raspbian
```sh
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```
See the document of the [@abandonware/noble](https://github.com/abandonware/noble#readme) for other operating systems details.

## Configuration
### .Env properties
**Requird Settings**
- SERVER_PORT

**Optional Settings**
- USE_MYSQL
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME

## Todo:

- Device state monitoring using Advertising packets 
- Add support for curtain moving mode
- Other device types?

## Community

* [SwitchBot (Official website)](https://www.switch-bot.com/)
* [Facebook @SwitchBotRobot](https://www.facebook.com/SwitchBotRobot/) 
* [Twitter @SwitchBot](https://twitter.com/switchbot) 
