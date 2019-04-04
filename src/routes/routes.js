import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import LoginPage from "../pages/LoginPage/LoginPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CreateAccountPage from '../pages/CreateAccountPage/CreateAccountPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import NewRecordingPage from '../pages/NewRecordingPage/NewRecordingPage';
import PastWorkoutsPage from '../pages/PastWorkoutsPage/PastWorkoutsPage';
import NewWorkoutPage from '../pages/NewWorkoutPage/NewWorkoutPage';


const Routes = props => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/account/login" render={() => !props.isAuth ? <LoginPage /> : <Redirect to="/workouts/pastWorkouts" />} />
      <Route path="/account/create" render={() => !props.isAuth ? <CreateAccountPage /> : <Redirect to="/workouts/newWorkout" />} />
      <Route path="/account/profile" render={() => props.isAuth ? <ProfilePage /> : <Redirect to="/" />} />
      <Route path="/workouts/newRecording" render={() => props.isAuth ? <NewRecordingPage /> : <Redirect to="/" />} />
      <Route path="/workouts/newWorkout" render={() => props.isAuth ? <NewWorkoutPage /> : <Redirect to="/" />} />
      <Route path="/workouts/pastWorkouts" render={() => props.isAuth ? <PastWorkoutsPage /> : <Redirect to="/" />} />
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
);

const mapStateToProps = state => ({
  isAuth: state.user.isAuth
})

export default connect(mapStateToProps)(Routes);
