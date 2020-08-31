import React from 'react'

import './sideDrawer.css'


const sideDrawer = props => {
    let drawerClasses = 'side-drawer';
    if (props.show) {
        drawerClasses = 'side-drawer open'
    }
    return (
        <nav className={drawerClasses}>
            <ul>
                <li className='links'>
                    <a className='list-item' href='/'>
                        Monitor
                </a> 
                </li>
                <li className='links'>
                    <a className='list-item' href='/events'>
                        Events
                </a>
                </li>
                <li className='links'>
                    <a className='list-item' href='/logs'>
                        Logs
                </a>
                </li>
                <li className='links'>
                    <a className='list-item' href='/ban'>
                        Bans
                </a>
                </li>
            </ul>
        </nav>)
};

export default sideDrawer