import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const LoginButton = styled.button`
  width: 300px;
`;

class SocialButton extends React.Component {
  render() {
    const { service, title, onClick } = this.props;
    return (
      <LoginButton className={`ui ${service} button`} onClick={onClick} name={title.toLowerCase()}>
        <i className={`${service} icon`}></i>
        Login with {title}
      </LoginButton>
    );
  }
}

SocialButton.propTypes = {
  service: PropTypes.string
};

export default SocialButton;
