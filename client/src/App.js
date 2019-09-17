import React, { Component } from "react";
import Login from "./Pages/Login";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Nav from "./Components/nav";

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Nav />
        <Route path="/" exact component={Login} />
        {/* <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} /> */}
      </BrowserRouter>
    );
  }
}

export default App;
