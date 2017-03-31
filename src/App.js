import React, { Component } from 'react';
import './App.css';
import Calendar from './basic'
import './style.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="container">
        	<Calendar className="calendar"/>
        </div>
      </div>
    );
  }
}

export default App;