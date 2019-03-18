import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CreateAccountPage from '../pages/CreateAccountPage/CreateAccountPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/account/login" component={LoginPage} />
      <Route path="/account/create" component={CreateAccountPage} />
      <Route path="/account/profile" component={ProfilePage} />
      <Route path="/account/forgot" component={ForgotPasswordPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
