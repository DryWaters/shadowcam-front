import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../components/LoginPage/LoginPage";
import InitialPage from "../components/InitialPage/InitialPage";
import NotFound from "../components/NotFound/NotFound";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LoginPage} />
      <Route path="/initial" component={InitialPage} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
