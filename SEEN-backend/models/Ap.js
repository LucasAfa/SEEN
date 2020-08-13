const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
    mac: {
        type: String,
        required: true,
        match: /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/
    },
    manufacturer: {
        type: String,
        require: false
    },
    dispositiveType: {
        type: String,
        required: false
    },
    userdispositiveType: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        required: false,
        match: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/
    },
    firmware: {
        type: String,
        required: false
    }
    // lastTimeSeen: {
    //     type: Date,
    //     default: Date.now
    // }
})

const ApSchema = mongoose.Schema({
    mac: {
        type: String,
        required: true,
        match: /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/
    },
    ip: {
        type: String,
        required: false,
        match: /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/
    },
    ssid: {
        type: String,
        required: false
    },
    securityProtocol: {
        type: String,
        required: false
    },
    // lastTimeSeen: {
    //     type: Date,
    //     default: Date.now
    // },
    devices: [DeviceSchema]
});

var Ap = mongoose.model('Ap', ApSchema);
Ap.Device = mongoose.model('Device', DeviceSchema);
module.exports = Ap;