import React from "react";
import Nav from "../Components/nav";
import LoginForm from "../Components/LoginForm";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Login = () => (
  <div>
    <Container>
      <LoginForm />
    </Container>
  </div>
);

export default Login;
