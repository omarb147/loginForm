import { GET_CURRENT_USER, LOGOUT_USER, LOGIN_ERROR } from "./Types";
import axios from "axios";

export const getCurrentUser = () => {
  return async dispatch => {
    const user = await axios.get("/auth/current_user");
    dispatch({
      type: GET_CURRENT_USER,
      user: user.data
    });
  };
};

export const logoutUser = () => {
  return async dispatch => {
    const res = await axios.get("/auth/logout");
    if (res) {
      dispatch({ type: LOGOUT_USER });
    }
  };
};

export const postLocalLogin = (identifier, password) => {
  return async dispatch => {
    try {
      const res = await axios.post("/auth/local", { identifier, password });
      const user = await axios.get("/auth/current_user");
      dispatch({
        type: GET_CURRENT_USER,
        user: user.data
      });
    } catch (error) {
      dispatch({ type: LOGIN_ERROR, error });
    }
  };
};
