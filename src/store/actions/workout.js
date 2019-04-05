import { START_WORKOUT } from "./actionTypes";
import { logout } from "./user";
import { loading, notLoading } from "./ui";

export const tryStartWorkout = (workoutData, token) => {
  return dispatch => {
    dispatch(loading());

    let url;

    if (process.env.REACT_APP_TEST) {
      url = "http://localhost:3000/workouts/create";
    } else {
      url = `https://shadowcam-back.herokuapp.com/workouts/create`;
    }

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      mode: "cors",
      body: JSON.stringify(workoutData)
    })
      .then(res => {
        if (res.status === 401) {
          return Promise.reject("unathorized");
        } else {
          return res.json();
        }
      })
      .then(parsedRes => {
        dispatch(notLoading());
        return dispatch(
          saveWorkoutData(
            Object.assign(workoutData, { work_id: parsedRes.message.work_id })
          )
        );
      })
      .catch(error => {
        dispatch(notLoading());
        if (error === "unathorized") {
          alert("Please log back in!");
          dispatch(logout());
        } else
          alert(
            "Unable to connect to server.  Please check internet connection." +
              error
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
