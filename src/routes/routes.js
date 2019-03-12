import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../components/LoginPage/LoginPage";
import LandingPage from "../components/LandingPage/LandingPage";
import NotFound from "../components/NotFound/NotFound";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/account/login" component={LoginPage} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
