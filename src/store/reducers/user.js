import { LOGIN, LOGOUT } from '../actions/actionTypes';


const initialState = {
  isAuth: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        isAuth: true
      }
    }
    case LOGOUT: {
      return {
        ...state,
        isAuth: false
      }
    }
    default:
      return state;
  }
};

export default userReducer;
