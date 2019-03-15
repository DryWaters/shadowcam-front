import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../components/LoginPage/LoginPage";
import LandingPage from "../components/LandingPage/LandingPage";
import NotFound from "../components/NotFound/NotFound";
import CreateAccountPage from '../components/CreateAccountPage/CreateAccountPage';
import ForgotPasswordPage from '../components/ForgotPasswordPage/ForgotPasswordPage';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/account/login" component={LoginPage} />
      <Route path="/account/create" component={CreateAccountPage} />
      <Route path="/account/forgot" component={ForgotPasswordPage} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
