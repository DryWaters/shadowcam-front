import { LOGIN, LOGOUT } from "./actionTypes";
import { loading, notLoading } from "./ui";

export const tryRegister = userData => {
  return dispatch => {
    let url;

    if (process.env.REACT_APP_TEST) {
      url = "http://localhost:3000/users/register";
    } else {
      url = `https://shadowcam-back.herokuapp.com/users/register`;
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
      body: JSON.stringify(userData)
    })
      .then(res => res.json())
      .then(parsedRes => {
        if (parsedRes.status === "ok") {
          dispatch(tryLogin(userData.email, userData.password));
        } else {
          // need to do something with errors
          return dispatch(notLoading());
        }
      })
      .catch(err => {
        alert(
          "Unable to connect to server.  Please check internet connection."
        );
      });
  };
};

export const loadToken = (token, expiresIn) => {
  return dispatch => {
    dispatch({
      type: LOGIN,
      payload: {
        token,
        expiresIn
      }
    });
  };
};

export const tryLogin = authData => {
  return dispatch => {
    let url;

    if (process.env.REACT_APP_TEST) {
      url = "http://localhost:3000/users/login";
    } else {
      url = `https://shadowcam-back.herokuapp.com/users/login`;
    }

    dispatch(loading());

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
          saveTokenToStorage(
            parsedRes.message.token,
            parsedRes.message.expiresIn
          );
          dispatch({
            type: LOGIN,
            payload: {
              token: parsedRes.message.token,
              expiresIn: parsedRes.message.expiresIn
            }
          });
          return dispatch(notLoading());
        } else {
          return dispatch(notLoading());
        }
      })
      .catch(err => {
        alert(
          "Unable to connect to server.  Please check internet connection."
        );
      });
  };
};

const saveTokenToStorage = (token, expiresIn) => {
  if (localStorage) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiresIn", expiresIn);
  }
};

export const logout = () => {
  return dispatch => {
    // remove token from local storage
    deleteTokenFromStorage();
    dispatch({
      type: "DELETE_TOKEN"
    });

    // then return action type LOGOUT
    return dispatch({
      type: LOGOUT
    });
  };
};

const deleteTokenFromStorage = () => {
  if (localStorage) {
    localStorage.clear();
  }
};
