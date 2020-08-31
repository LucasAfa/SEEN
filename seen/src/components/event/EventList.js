import React, { Component } from 'react'
import EventCard from './EventCard';


const eventListStyle = {
        padding: "0px",
        height: "100%",
        width: "100%",
        margin:" 0px auto 0px auto",
        overflow: "hidden",
        listStyle: "none"
}

function getTypeMap(Aps) {
    let map = {};
    Aps.forEach((ap) => {
        if(ap.devices !== undefined) {
            ap.devices.forEach(device => {
                let type = "";
                device.dispositiveType === undefined ? type = "Not registered" : type = device.dispositiveType;
                map[device.mac] = type;
            })
        }
    })
    return map;
}

export default class EventList extends Component {
    
    render() {

        const { Events, Aps } = this.props;
        const macTypeMap = getTypeMap(Aps);
        console.log(Events)
        console.log(Aps)
        const listEvents = Events.splice(0).reverse().map(event => (
            <EventCard key={event.timestamp} event={event} type={macTypeMap[event.targetAddrMac]} />))

        return (
            <div style={eventListStyle}>
                { listEvents }
            </div>
        )
    }
}
