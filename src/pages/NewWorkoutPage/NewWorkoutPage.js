import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import { withRouter } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

import { tryStartWorkout } from "../../store/actions/workout";
import { formatTimeFromSeconds } from "../../utils/utils";

import loadingSpinner from "../../assets/images/loading-spinner.gif";
import styles from "./NewWorkoutPage.module.css";

export class NewWorkoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalTime: 0,
      restTimeMin: 0,
      restTimeSec: 0,
      intervalTimeMin: 0,
      intervalTimeSec: 0,
      numberInterval: 1,
      errorMessage: null
    };
  }

  // wait for the value to be updated before
  // calculating the new updated total time
  handleInputChange = async event => {
    if (!isNaN(parseInt(event.target.value))) {
      await this.setState({
        [event.target.id]: parseInt(event.target.value)
      });
    }
    this.setState({
      totalTime: this.getTotalTime()
    });
  };

  // calculate the total time
  getTotalTime = () => {
    if (this.state.intervalTimeMin <= 0 && this.state.intervalTimeSec <= 0) {
      return 0;
    }
    return (
      (this.state.intervalTimeMin * 60 + this.state.intervalTimeSec) *
        this.state.numberInterval +
      (this.state.restTimeMin * 60 + this.state.restTimeSec) *
        (this.state.numberInterval - 1)
    );
  };

  // form submission handler
  handleSubmit = event => {
    event.preventDefault();
    const totalTime = this.getTotalTime();

    if (totalTime <= 0) {
      this.setState({
        errorMessage: "Total workout time must be greater than 0"
      });
    } else {
      const timestamp = new moment().format();
      const workout_length = totalTime;
      const num_of_intervals = this.state.numberInterval;
      const interval_length =
        this.state.intervalTimeMin * 60 + this.state.intervalTimeSec;
      const rest_time = this.state.restTimeMin * 60 + this.state.restTimeSec;

      const workoutData = {
        recording_date: timestamp,
        workout_length,
        num_of_intervals,
        interval_length,
        rest_time
      };

      // save new workout data in state
      this.props.tryStartWorkout(workoutData, this.props.token).then(result => {
        if (result) {
          // forward to new recording page
          this.props.history.push("/workouts/newRecording");
        }
      });
    }
  };

  render() {
    // display spinner if loading
    const shouldDisplayButton = () => {
      if (this.props.isLoading) {
        return (
          <Button disabled>
            <img
              src={loadingSpinner}
              alt="Loading Spinner"
              className={styles.loadingSpinner}
            />
          </Button>
        );
      } else {
        return <Button>Start Workout!</Button>;
      }
    };

    return (
      <Layout>
        <Container className={styles.newWorkoutContainer}>
          <Row>
            <Col className={styles.error}>{this.state.errorMessage}</Col>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={this.handleSubmit} className={styles.form}>
                <div className={styles.timeCategory}>
                  Total Workout Time:{" "}
                  {formatTimeFromSeconds(this.state.totalTime)}
                </div>
                <div className={styles.timeCategory}>Rest time</div>
                <FormGroup row className={styles.spacer}>
                  <Label sm="2" for="restTimeMin">
                    Minutes
                  </Label>
                  <Col sm="4" md="3">
                    <Input
                      type="number"
                      min="0"
                      id="restTimeMin"
                      value={this.state.restTimeMin}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                  <Label sm="2" for="restTimeSec">
                    Seconds
                  </Label>
                  <Col sm="4" md="3">
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      id="restTimeSec"
                      value={this.state.restTimeSec}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                </FormGroup>
                <div className={styles.timeCategory}>Interval time</div>
                <FormGroup row className={styles.spacer}>
                  <Label sm="2" for="intervalTimeMin">
                    Minutes
                  </Label>
                  <Col sm="4" md="3">
                    <Input
                      type="number"
                      min="0"
                      id="intervalTimeMin"
                      value={this.state.intervalTimeMin}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                  <Label sm="2" for="intervalTimeSec">
                    Seconds
                  </Label>
                  <Col sm="4" md="3">
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      id="intervalTimeSec"
                      value={this.state.intervalTimeSec}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row className={styles.spacer}>
                  <Label sm="6" xl="6" for="numberInterval">
                    Number of Intervals
                  </Label>
                  <Col sm="4">
                    <Input
                      type="number"
                      min="1"
                      id="numberInterval"
                      value={this.state.numberInterval}
                      onChange={this.handleInputChange}
                      placeholder="Number of Intervals"
                      required
                    />
                  </Col>
                </FormGroup>
                <Row className={styles.spacer}>
                  <Col className={styles.submitButtonContainer}>
                    {shouldDisplayButton()}
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  tryStartWorkout: (workoutData, token) =>
    dispatch(tryStartWorkout(workoutData, token))
});

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading,
  token: state.user.token
});

// wrap withRouter to get access to history
// to push to new page
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewWorkoutPage));
