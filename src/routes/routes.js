import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CreateAccountPage from '../pages/CreateAccountPage/CreateAccountPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import NewRecordingPage from '../pages/NewRecordingPage/NewRecordingPage';
import PastRecordingsPage from '../pages/PastRecordingsPage/PastRecordingsPage';

import { connect } from 'react-redux';

const Routes = props => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/account/login" component={LoginPage} />
      <Route path="/account/create" component={CreateAccountPage} />} />
      <Route path="/account/profile" render={() => props.isAuth ? <ProfilePage /> : <Redirect to="/" />} />
      <Route path="/session/newSession" render={() => props.isAuth ? <NewRecordingPage /> : <Redirect to="/" />} />
      <Route path="/session/pastSessions" render={() => props.isAuth ? <PastRecordingsPage /> : <Redirect to="/" />} />
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
);

const mapStateToProps = state => ({
  isAuth: state.user.isAuth
})

export default connect(mapStateToProps)(Routes);
