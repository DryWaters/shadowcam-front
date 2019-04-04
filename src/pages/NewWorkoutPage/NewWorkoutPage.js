import React, { Component } from "react";
import {
  Row,
  Container,
  Col,
  Form,
  Input,
  Button,
  Label,
  FormGroup
} from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { tryStartWorkout } from "../../store/actions/workout";
import loadingSpinner from "../../assets/images/loading-spinner.gif";
import moment from "moment";

import styles from "./NewWorkoutPage.module.css";

export class NewWorkoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalTimeMin: 0,
      totalTimeSec: 0,
      intervalTimeMin: 0,
      intervalTimeSec: 0,
      numberInterval: 1,
      errorMessage: null
    };
  }


  handleInputChange = event => {
    if (!isNaN(parseInt(event.target.value))) {
      this.setState({
        [event.target.id]: parseInt(event.target.value)
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const totalTime = this.state.totalTimeMin * 60 + this.state.totalTimeSec;
    const totalIntervalTime =
      (this.state.intervalTimeMin * 60 + this.state.intervalTimeSec) *
      this.state.numberInterval;
    if (totalTime - totalIntervalTime < 0) {
      this.setState({
        errorMessage:
          "Total workout time must be greater or equal to the total interval time"
      });
    } else if (totalTime <= 0) {
      this.setState({
        errorMessage: "Total workout time must be greater than 0"
      });
    } else {
      const timestamp = new moment().format();
      const workout_length =
        this.state.totalTimeMin * 60 + this.state.totalTimeSec;
      const num_of_intervals = this.state.numberInterval;
      const interval_length =
        (this.state.intervalTimeMin * 60 + this.state.intervalTimeSec) *
        this.state.numberInterval;

      const workoutData = {
        recording_date: timestamp,
        workout_length,
        num_of_intervals,
        interval_length
      };

      // save new workout data in state
      this.props.tryStartWorkout(workoutData).then(result => {
        if (result) {
          // forward to new recording page
          this.props.history.push('/workouts/newRecording');
        }
      });
    }
  };

  render() {
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
                <div className={styles.timeCategory}>Total time</div>
                <FormGroup row className={styles.spacer}>
                  <Label sm="2" for="totalTimeMin">
                    Minutes
                  </Label>
                  <Col sm="4" md="3">
                    <Input
                      type="number"
                      min="0"
                      id="totalTimeMin"
                      value={this.state.totalTimeMin}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                  <Label sm="2" for="totalTimeSec">
                    Seconds
                  </Label>
                  <Col sm="4" md="3">
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      id="totalTimeSec"
                      value={this.state.totalTimeSec}
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
  tryStartWorkout: workoutData => dispatch(tryStartWorkout(workoutData))
});

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewWorkoutPage));
