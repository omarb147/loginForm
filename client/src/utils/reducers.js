import { GET_CURRENT_USER, LOGOUT_USER, LOCAL_LOGIN, LOGIN_ERROR } from "./Types";

const initialState = {
  loggedIn: false,
  user: {},
  error: false
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_USER:
      let loggedIn = false;
      if (action.user.id) {
        loggedIn = true;
      }
      console.log(loggedIn);
      return { ...state, loggedIn, user: action.user, error: false };

    case LOGOUT_USER:
      return { ...state, loggedIn: false, user: {}, error: false };

    case LOGIN_ERROR:
      return { ...state, error: true };
  }

  return state;
};
