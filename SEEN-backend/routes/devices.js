const express = require('express');
const router = express.Router();
const Dev = require('../models/Dev')
var _ = require('underscore');


function onlyNotEmpty(req, res, next) {
    const out = {};
    _(req.body).forEach((value, key) => {
        console.log(value)
        if (!(value==null)) {
            out[key] = value;
        }
    });

    req.bodyNotEmpty = out;
    next();
}


// Get all Dev
router.get('/', (req, res) => {
    Dev.find()
    .then(data => {
        res.json(data)
    })
    .catch(() => {
        res.status(400).json({ msg: 'Events not found' })
    })
});

// Get DEV by mac
router.get('/:mac', (req, res) => {
    Dev.findOne({ "mac": req.params.mac })
        .then(data => {
            res.json(data);
        })
        .catch(() => {
            res.status(400).json({ msg: 'Access Point not found' })
        });
});


// Post new Device;
router.post('/', onlyNotEmpty,(req, res) => {
    const ap = new Dev(req.bodyNotEmpty)

    ap.save()
        .then(data => {
            res.json(data)
        })
        .catch((err) => {
            res.status(400).json({ msg: 'Something went wrong. Probably you need to fill all the necessary fields' })
        })
});



// Edit Device
router.put('/:mac', onlyNotEmpty, (req, res) => {
    Dev.updateOne({ "mac": req.params.mac }, {
        $set:  req.bodyNotEmpty 
    })
    .then(data => {
        res.json({ msg: 'Dev updated' })
    })
    .catch(err => {
        res.status(400).json({ msg: 'Dev not found' })
    });
});

// Delete Device;
router.delete('/:mac', (req, res) => {
    Dev.deleteOne({ mac: req.params.mac }, (err, result) => {
        res.json({ msg: "Device deleted" })
    })
})


module.exports = router;