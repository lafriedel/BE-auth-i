import React from "react";
import axios from "axios";
import LoginRegister from "./LoginRegister";
import Dashboard from "./Dashboard";
import { Route } from "react-router-dom";

const authenticate = Dashboard => LoginRegister =>
  class extends React.Component {
    state = {
      user: {
        username: "",
        password: ""
      },
      userLoggedIn: false
    };

    componentDidMount() {
        // axios.get("http://localhost:8000/api/restricted")
        //     .then(res =>
        //         console.log(res))
        //     .catch(err => console.log(err))
        const api = axios.create({
            withCredentials: true
        });
        
    }

    userFormChange = e => {
      this.setState({
        ...this.state,
        user: {
          ...this.state.user,
          [e.target.name]: e.target.value
        }
      });
    };

    logIn = e => {
      e.preventDefault();
      axios
        .post("http://localhost:8000/api/login", this.state.user)
        .then(res => {
          console.log(res);
          this.setState({
            ...this.state,
            user: {
              ...this.state.user,
              password: ""
            },
            userLoggedIn: true
          });
          this.props.history.push("/dashboard");
        })
        .catch();
    };

    render() {
      return this.state.userLoggedIn ? (
        <Route
          path="/dashboard"
          render={props => (
            <Dashboard {...props} username={this.state.user.username} />
          )}
        />
      ) : (
        <LoginRegister
          history={this.props.history}
          userFormChange={this.userFormChange}
          logIn={this.logIn}
          user={this.state.user}
        />
      );
    }
  };

export default authenticate(Dashboard)(LoginRegister);
