import { LOGIN, REGISTER, LOGOUT } from "./actionTypes";

export const register = userData => {
  return dispatch => {
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
      type: "LOADING"
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
        if (parsedRes.status === "ok") {
          dispatch({
            type: "SAVE_TOKEN",
            payload: {
              token: parsedRes.message.token,
              expiresIn: parsedRes.message.expiresIn
            }
          });
          dispatch({
            type: "NOT_LOADING"
          });
          return dispatch({
            type: LOGIN
          });
        } else {
          // display alert?  something, invalid password

          dispatch({
            type: "NOT_LOADING"
          });
        }
      })
      .catch(err => {
        // do something, display alert?  unable to connect to backend
      });
  };
};

export const logout = () => {
  return dispatch => {
    // remove token from local storage
    dispatch({
      type: "DELETE_TOKEN"
    })

    // then return action type LOGOUT
    return dispatch({
      type: LOGOUT
    });
  };
};
