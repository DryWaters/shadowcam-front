import { START_WORKOUT, STOP_WORKOUT } from "./actionTypes";
import { loading, notLoading } from "./ui";

export const tryStartWorkout = workoutData => {
  return dispatch => {
    // dispatch(loading());

    let url;

    if (process.env.REACT_APP_TEST) {
      url =
        "https://8d04e628-eb5e-47f6-b572-89a525f0f298.mock.pstmn.io/workouts/create";
    } else {
      url = `https://shadowcam-back.herokuapp.com/workouts/create`;
    }

    // Remove after done testing.
    return new Promise((resolve, reject) => {
      resolve(
        dispatch(saveWorkoutData(Object.assign(workoutData, { work_id: 1 })))
      );
    });

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify(workoutData)
    })
      .then(res => res.json())
      .then(parsedRes => {
        dispatch(notLoading());
        return dispatch(
          saveWorkoutData(Object.assign(workoutData, parsedRes.message))
        );
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
    return dispatch({
      type: START_WORKOUT,
      payload: workoutData
    });
  };
};
