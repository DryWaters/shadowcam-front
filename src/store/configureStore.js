import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import user from "./reducers/user";
import video from "./reducers/video";
import ui from "./reducers/ui";
import workout from "./reducers/workout";

const rootReducer = combineReducers({
  ui,
  user,
  video,
  workout
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () =>
  createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default configureStore;
