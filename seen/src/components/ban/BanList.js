import React, { Component } from 'react'
import BanCard from './BanCard';


const DevicesListStyle = {
        padding: "0px",
        height: "100%",
        width: "100%",
        margin:" 0px auto 0px auto",
        overflow: "hidden",
        listStyle: "none"
}

export default class EventList extends Component {
    
    render() {
        const { Devices } = this.props;
        const listDevices = Devices.map(device => (
            <BanCard key={device.mac} device={device} type={(device.userdispositiveType === undefined? (device.dispositiveType === undefined? 'Not registered' :device.dispositiveType) : device.userdispositiveType)} />))

        return (
            <div style={DevicesListStyle}>
                { listDevices }
            </div>
        )
    }
}
