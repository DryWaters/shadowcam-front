import { LOGIN, REGISTER, LOGOUT } from "./actionTypes";

export const register = userData => {
  return (dispatch, getState) => {
    const url = "https://shadowcam-back. ";
  };
};

export const tryLogin = authData => {
  return dispatch => {
    let url;

    if (process.env.REACT_APP_TEST) {
      url = "http://localhost:3000/users/login";
      console.log(authData);
    } else {
      url = `https://shadowcam-back.herokuapp.com/users/login`;
    }

    dispatch({
      type: "LOADING",
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({
        email: authData.email,
        password: authData.password
      })
    })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        if (parsedRes.status === "ok") {
          dispatch({
            type: "SAVE_TOKEN",
            payload: {
              token: parsedRes.message.token,
              expiresIn: parsedRes.message.expiresIn
            }
          });
          dispatch({
            type: "DONE_LOADING",
          });
          return dispatch({
            type: LOGIN
          });
        } else {

        }
      })
      .catch(err => {
        // do something unable to connect to backend
      });
  };
};

export const logout = () => {
  return dispatch => {
    // remove token from local storage
    // then return action type LOGOUT
    return dispatch({
      type: LOGOUT
    });
  };
};
