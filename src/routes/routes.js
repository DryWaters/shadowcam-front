import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CreateAccountPage from '../pages/CreateAccountPage/CreateAccountPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import { connect } from 'react-redux';

const Routes = props => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/account/login" component={LoginPage} />
      <Route path="/account/create" component={CreateAccountPage} />} />
      <Route path="/account/profile" render={() => props.isAuth ? <ProfilePage /> : <Redirect to="/" />} />
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
);

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
})

export default connect(mapStateToProps)(Routes);
