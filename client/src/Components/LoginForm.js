import React, { Component } from "react";
import SocialButton from "./SocialButton";
import { connect } from "react-redux";
import { loginRequest } from "../utils/actionCreators";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 500px;
  justify-content: flex-end;
`;

class LoginForm extends Component {
  render() {
    return (
      <Container className="ui placeholder segment">
        <div className="ui one column very relaxed stackable grid">
          <div className="column">
            <div className="ui form">
              <div className="field">
                <label>Username</label>
                <div className="ui left icon input">
                  <input type="text" placeholder="Username" />
                  <i className="user icon"></i>
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="ui left icon input">
                  <input type="password" />
                  <i className="lock icon"></i>
                </div>
              </div>
              <div className="ui blue submit button">Login</div>
            </div>
            <div className="ui horizontal divider">Or</div>
          </div>
          <div className="middle aligned column">
            <SocialButton title="Facebook" service="facebook" onClick={this.onSocialButtonClick} />
            <SocialButton title="Google" service="google plus" onClick={this.onSocialButtonClick} />
          </div>
        </div>
      </Container>
    );
  }

  onSocialButtonClick = event => {
    const service = event.target.name;
    this.props.loginRequest(service);
  };
}

const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  { loginRequest }
)(LoginForm);
