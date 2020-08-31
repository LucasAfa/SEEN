import React, { Component } from 'react'
import './BanCard.css'
import apis from '../../api/index';

const macMap = require("../../mac.json")

const colorMapping = {
    "Normal": "#fff"
}

const containerStyle = {
    padding: "2px 16px"
    
}
function teste (mac){
    console.log(mac)
    apis.editBan({"mac":mac,"ban":false})
    document.getElementById(mac).style.display = "none";
}

export default class BanCard extends Component {

    

    render() {

        const device = this.props.device;
        const type = this.props.type;

        var cardStyle = {
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            transition: "0.3s",
            borderRadius: "5px",
            display: "flex",
            justifyContent: 'center',
            alignItems: "center",
            backgroundColor: "#fff",
            height: "100%",
            margin: "10px",
        }
        if(device.ban==false){
            cardStyle = {
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                transition: "0.3s",
                borderRadius: "5px",
                display: "none",
                justifyContent: 'center',
                alignItems: "center",
                backgroundColor: "#fff",
                height: "100%",
                margin: "10px",
            }
        }
        return (
                <div style={cardStyle} id={device.mac} >
                    <div style={containerStyle}>
                        <p>
                            <b>Dispositive MAC:</b> {device.mac}
                        </p>
                        <p>
                            <b>Dispositive Type:</b> {type}
                        </p>
                        <p>
                            <b>Manucfacter:</b> {macMap[device.mac.substring(0, 8)] === undefined ? "Manufacturer not found" : macMap[device.mac.substring(0, 8)]}
                        </p>
                        <button onClick={() => teste(device.mac,this)}>UnBan</button>
                    </div>
                </div>
        )
    }
}
