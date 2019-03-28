import { LOGIN, LOGOUT, REGISTER, SAVE_TOKEN, DELETE_TOKEN } from "../actions/actionTypes";

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
    case SAVE_TOKEN: {
      return {
        ...state,
        token: action.payload.token,
        expiresIn: action.payload.expiresIn
      };
    }
    default:
      return state;
  }
};

export default userReducer;
