import { START_WORKOUT, STOP_WORKOUT } from "../actions/actionTypes";

const initialState = {
  workout: {
    work_id: 0,
    work_len: 0,
    num_of_int: 0,
    int_len: 0
  }
};

const workoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_WORKOUT: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};

export default workoutReducer;
