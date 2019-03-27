import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import user from "./reducers/user";
import video from "./reducers/video";
import ui from "./reducers/ui";

const rootReducer = combineReducers({
  ui,
  user,
  video
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () =>
  createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default configureStore;
