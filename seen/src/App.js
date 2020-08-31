import React, { Component } from 'react';
import './App.scss';

// import Header from './components/layout/header/Header';
import Graph from './components/graph/Graph';
import Backdrop from './components/backdrop/backdrop'
import Toolbar from './components/toolbar/toolbar';
import Event from './components/event/event';
import SideDrawer from './components/layout/sideDrawer/sideDrawer';
import Log from './components/log/log';
import Ban from './components/ban/ban';


import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


class App extends Component {

  state = {
    sideDrawerOpen: false
  }

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  drawerToogleClickHandler = () => {
    // console.log('rodou')

    //Esse setState serve pra controlar o estado da sidebar (hamburguer)
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    })
  }

  render() {
    let backdrop;
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (
      <Router>
        <div style={{ heigth: '100%' }} className="App">
          <Toolbar drawerClickHandler={this.drawerToogleClickHandler} />
          <SideDrawer show={this.state.sideDrawerOpen} />
          {backdrop}
          <Switch>
            <Route path='/events' component={Event} />
            <Route path='/' exact component={Graph} />
            <Route path='/logs' component={Log} />
            <Route path='/ban' component={Ban} />
          </Switch>
        </div>
      </Router>
      // <div className='App'>
      //   <Header />
      //   <Graph />
      // </div>
    )
  } 
}

export default App;
