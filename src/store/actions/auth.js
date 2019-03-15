import { LOGIN, LOGOUT } from "./actionTypes";

export const tryLogin = authData => {
  return dispatch => {
    console.log(
      `Checking password and logging in! with ${authData.email} and ${
        authData.password
      }`
    );

    const API_KEY = "somethingWeMakeUp";
    const url = `https://shadowcam-back.herokuapp.com/account/login?key=${API_KEY}`;

    // fetch url with method post and email/password
    /*
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: authData.email,
        password: authData.password
      })
    })
    // parse the JSON data
    .then(res => res.json())

    // parsed data now check if have valid token
    .then(parsedRes => {
      if (!parsedRes.idToken) {
        // do something did not get a id token from backend
      } else {
        // got a token, do something with it
        // dispatch action to store in local storage
        // dispatch action to store it in state also
      }
    })
    .catch(err => {
      // do something unable to connect to backend
    })
    */

    // finally return action type LOGIN, eventually will have token
    console.log("logging in");
    return dispatch({
      type: LOGIN
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
