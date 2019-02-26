import React, { Component } from 'react';
import LoginRegister from "./components/LoginRegister";
import './App.css';

class App extends Component {
  state = {
    user: {
      username: "",
      password: ""
    }
  }
  render() {
    return (
      <div className="App">
        <LoginRegister user={this.state.user} />
      </div>
    );
  }
}

export default App;
