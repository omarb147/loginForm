import { createStore, combineReducers, applyMiddleware } from "redux";
import { loginReducer } from "./reducers";
import thunk from "redux-thunk";

const rootReducer = combineReducers({ loginData: loginReducer });

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
