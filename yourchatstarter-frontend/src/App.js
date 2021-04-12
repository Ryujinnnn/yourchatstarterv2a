import './App.css';
import React, { Component } from 'react';
import { Header } from './Component/Header/Header'
import Routes from './Routes'
 

class App extends Component {

  render() {
    return (
      <div className="App" style={{backgroundColor: "#c27ac2"}}>
          <Header></Header>
          <Routes></Routes>
          
      </div>
    );
  }
}

export default App;
