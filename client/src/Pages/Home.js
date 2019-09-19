import React, { Component } from "react";
import { connect } from "react-redux";
import { getCurrentUser } from "../utils/actionCreators";
import styled from "styled-components";
import Login from "./Login";
import LoginForm from "../Components/LoginForm";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: red;
`;

export class Home extends Component {
  componentDidMount() {
    this.props.getCurrentUser();
  }

  render() {
    const { loggedIn, user } = this.props.auth;

    if (!loggedIn) {
      return <Login />;
    }

    return (
      <Container>
        <h1>Hello World</h1>
      </Container>
    );
  }
}

const mapPropsToState = state => {
  return state;
};

export default connect(
  mapPropsToState,
  { getCurrentUser }
)(Home);
