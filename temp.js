import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: {firstName: "Serenity", lastName: "Amamou"}
    }
  }
  hello(user){
    return "Good morning " + user.firstName + " " + user.lastName;
  }  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          {this.hello(this.state.user)}
        </p>
      </div>
    );
  }
}

export default App;
