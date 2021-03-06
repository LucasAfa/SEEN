const express = require('express');
const router = express.Router();
const Event = require('../models/Event')

// Get all events
router.get('/', (req, res) => {
    Event.find()
    .then(data => {
        res.json(data)
    })
    .catch(() => {
        res.status(400).json({ msg: 'Events not found' })
    })
});

router.get('/:id', (req, res) => {
    Event.findById(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(() => {
            res.status(400).json({ msg: 'Event not found' })
        });
})

// Publish new event
router.post('/', (req, res) => {
    const event = new Event({
        eventType: req.body.eventType,
        targetAddrMac: req.body.targetAddrMac,
        duration: req.body.duration
    })

    event.save()
    .then(data => {
        res.json(data);
    })
    .catch(() => {
        res.status(400).json({ msg: 'Something went wrong. Probably you need to fill all the necessary fields or eventType is wrong' })
    })
})

router.delete('/', (req, res) => {
    Event.deleteMany({}, (err, result) => {
        res.json({ msg: "Deleted all events" })
    })
})

module.exports = router;