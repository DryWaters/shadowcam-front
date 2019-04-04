import { START_WORKOUT, STOP_WORKOUT } from "../actions/actionTypes";

const initialState = {
  work_id: 0,
  workout_length: 0,
  num_of_intervals: 0,
  interval_length: 0
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
