# Local Switchbot Api

My Node.js local switchbot api project to prevent using their cloud based open API. No longer dependent on an internet connection or switchbot servers.

Project created using [node-switchbot](https://www.npmjs.com/package/node-switchbot) package.

To use the project you need:
- Linux device
- BTE compatible adapter

## Currently suupported
- Switchbot Curtain
    - Open
    - Close
    - runToPos

## Custom device names
Turn on by adding env prop (USE_MYSQL = "true") to .env file

## Routes

### /devices
Returns list of all found devices.

### /devices/id/:id
Returns device by device id

### /devices/id/:id/setName/:name
Sets custom device name (use_mysql required!)

### /devices/name/:name
Returns device by custom name (use_mysql required!)

### /devices/id/:id/open
Open curtain by device id

### /devices/id/:id/close
Close curtain by device id

### /devices/id/:id/runToPos/:position
Set curtain position by device id

## .Env props

### Required
- SERVER_PORT

### Only required when using mysql custom names
- USE_MYSQL
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME


## Todo:
- Device state monitoring using Advertising packets 
- Add support for curtain moving mode
- Other device types?
