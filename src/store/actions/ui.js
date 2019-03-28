import { LOADING, NOT_LOADING } from "./actionTypes";

export const loading = () => {
  return dispatch => {
    return dispatch({
      type: LOADING
    });
  };
};

export const notLoading = () => {
  return dispatch => {
    return dispatch({
      type: NOT_LOADING
    });
  };
};
