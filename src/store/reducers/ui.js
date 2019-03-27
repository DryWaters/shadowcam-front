import { LOADING, DONE_LOADING } from "../actions/actionTypes";

const initialState = {
  isLoading: false
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING: {
      return {
        ...state,
        isLoading: true
      };
    }
    case DONE_LOADING: {
      return {
        ...state,
        isLoading: false
      };
    }
    default:
      return state;
  }
};

export default uiReducer;

