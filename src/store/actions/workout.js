import { START_WORKOUT, STOP_WORKOUT } from "./actionTypes";
import { loading, notLoading } from "./ui";

export const tryStartWorkout = workoutData => {
  return dispatch => {
    
    dispatch(loading());

    let url;

    if (process.env.REACT_APP_TEST) {
      url =
        "https://8d04e628-eb5e-47f6-b572-89a525f0f298.mock.pstmn.io/workouts/create";
    } else {
      url = `https://shadowcam-back.herokuapp.com/workouts/create`;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify(workoutData)
    })
      .then(res => res.json())
      .then(parsedRes => {
        dispatch(
          saveWorkoutData(Object.assign(workoutData, parsedRes.message))
        );
        dispatch(notLoading());
      })
      .catch(error => {
        dispatch(notLoading());
        alert(
          "Unable to connect to server.  Please check internet connection."
        );
      });
  };
};

export const saveWorkoutData = workoutData => {
  return dispatch => {
    dispatch({
      type: START_WORKOUT,
      payload: workoutData
    });
  };
};
