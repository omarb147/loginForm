import { LOGIN_REQUEST } from "./Types";

const initialState = {
  loggedIn: false,
  token: ""
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      console.log(action.token);

      return { loggedIn: true, token: action.token, ...state };
  }

  return state;
};
