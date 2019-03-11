import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import FirstTimePage from "../pages/FirstTimePage";
import NoPageFound from "../pages/NoPageFound";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LoginPage} />
      <Route exact path="/first" component={FirstTimePage} />
      <Route component={NoPageFound} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
