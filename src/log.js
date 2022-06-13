module.exports = Log = (message) => {
    console.log(`[${new Date().getHours()}:${new Date().getMinutes()}] ${message}`);
}