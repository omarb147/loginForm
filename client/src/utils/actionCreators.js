import { LOGIN_REQUEST } from "./Types";
import axios from "axios";

export const loginRequest = (service, payload = {}) => {
  return async dispatch => {
    let res;

    switch (service) {
      case "facebook":
        res = await axios.get("http://localhost:4000/auth/facebook");
        break;
      case "google":
        res = await axios.get("http://localhost:4000/auth/google");
        break;
      case "local":
        res = await axios.post("http://localhost:4000/auth/local", {
          params: {
            identifier: payload.identifier,
            password: payload.password
          }
        });
        break;
    }
    console.log(res);

    return dispatch({
      type: LOGIN_REQUEST,
      token: res
    });
  };
};
