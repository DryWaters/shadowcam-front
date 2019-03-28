import { LOGIN, LOGOUT } from "../actions/actionTypes";

const initialState = {
  isAuth: false,
  token: null,
  expiresIn: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        isAuth: true,
        token: action.payload.token,
        expiresIn: action.payload.expiresIn
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isAuth: false,
        token: null,
        expiresIn: null
      };
    }
    default:
      return state;
  }
};

export default userReducer;
