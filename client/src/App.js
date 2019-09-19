import React, { Component } from "react";
import Login from "./Pages/Login";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Nav from "./Components/nav";
import Home from "./Pages/Home";

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Nav />
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        {/* <Route path="/users/" component={Users} /> */}
      </BrowserRouter>
    );
  }
}

export default App;
