import React, { Component } from 'react'
import './ban.css';
import { getAllBans, editBan } from '../../api/index';
import BanList from './BanList'





export default class ban extends Component {



    state = {
        Devices: [],
      }

  
    componentDidMount() {
        getAllBans()
        .then(res => {
            this.setState({
                Devices: res.data});
        })
    }

    render() {
        return(
            <div className="generalBox">
                <div className="pageTitle">
                    Bans
                </div>
                
                <BanList Devices={this.state.Devices}
                ></BanList>
        
            </div>
        )

        // return this.state.Events.map(event => (
        //     <EventCard event={event}/>
        // ));
    }
}
