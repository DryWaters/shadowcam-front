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

    dispatch(loading());

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
        dispatch(notLoading());
        alert(
          "Unable to connect to server.  Please check internet connection."
        );
      });
  };
};

// load token into state store
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

// Try and login to application
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

          // save the token to storage to lookup later
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

          // do something with error?
          return dispatch(notLoading());
        }
      })
      .catch(err => {
        dispatch(notLoading());
        alert(
          "Unable to connect to server.  Please check internet connection."
        );
      });
  };
};

// save the token to local storage
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

    // then logout the user
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
