import React from "react";
import { connect } from "react-redux";
import { logoutUser } from "../utils/actionCreators";
import { Link } from "react-router-dom";
import Login from "../Pages/Login";
import { Home } from "../Pages/Home";
const Nav = props => {
  const { loggedIn, logoutUser } = props;
  return (
    <div className="ui top fixed menu">
      <div className="item">
        <a>LOGIN PLATFORM</a>
      </div>
      <div className="right menu">
        <div className="item">
          {!loggedIn && <Link to={Login}>Log In</Link>}
          {loggedIn && (
            <Link to={Home} onClick={logoutUser}>
              Log Out
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  return { loggedIn: state.auth.loggedIn };
};

export default connect(
  mapStateToProps,
  { logoutUser }
)(Nav);
