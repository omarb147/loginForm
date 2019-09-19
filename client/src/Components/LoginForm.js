import React, { Component } from "react";
import SocialButton from "./SocialButton";
import { connect } from "react-redux";
import FormError from "./FormError";
import { getCurrentUser, postLocalLogin } from "../utils/actionCreators";
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
    const { error } = this.props.auth;
    return (
      <Container className="ui placeholder segment">
        <div className="ui one column very relaxed stackable grid">
          <div className="column">
            {error && <FormError />}
            <form className="ui form" onSubmit={this.onFormSubmit}>
              <div className="field">
                <label>Username</label>
                <div className="ui left icon input">
                  <input type="text" placeholder="Username" name="identifier" />
                  <i className="user icon"></i>
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="ui left icon input">
                  <input type="password" name="password" />
                  <i className="lock icon"></i>
                </div>
              </div>
              <button className="ui blue submit button">Login</button>
            </form>
            <div className="ui horizontal divider">Or</div>
          </div>
          <div className="middle aligned column">
            <SocialButton title="Facebook" service="facebook" />
            <SocialButton title="Google" service="google plus" />
          </div>
        </div>
      </Container>
    );
  }
  onFormSubmit = event => {
    event.preventDefault();
    const identifier = event.target.identifier.value;
    const password = event.target.password.value;
    this.props.postLocalLogin(identifier, password);
  };
}

const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  { getCurrentUser, postLocalLogin }
)(LoginForm);
