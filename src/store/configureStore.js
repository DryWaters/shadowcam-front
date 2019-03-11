import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import auth from "./reducers/auth";
import video from "./reducers/video";

const rootReducer = combineReducers({
  auth,
  video
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () =>
  createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default configureStore;
