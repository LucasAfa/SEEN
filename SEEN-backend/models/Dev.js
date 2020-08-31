const mongoose = require('mongoose');

const DevSchema = mongoose.Schema({
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
    ban: {
        type: Boolean,
        required: false
    },
    wireless: {
        type: Boolean,
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


module.exports = mongoose.model('device', DevSchema);