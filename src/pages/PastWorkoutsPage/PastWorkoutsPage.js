import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import Moment from "moment";
import Layout from "../../components/Layout/Layout";
import { loading, notLoading } from "../../store/actions/ui";
import { formatTimeFromSeconds } from "../../utils/utils";
import loadingSpinner from "../../assets/images/loading-spinner.gif";

import styles from "./PastWorkoutsPage.module.css";

export class PastWorkoutsPage extends Component {
  state = {
    currentWorkout: null,
    workouts: null
  };

  componentDidMount() {
    this.props.loading();

    let url;

    if (process.env.REACT_APP_TEST) {
      url = "http://localhost:3000/workouts";
    } else {
      url = `https://shadowcam-back.herokuapp.com/workouts`;
    }

    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token}`
      },
      mode: "cors"
    })
      .then(res => {
        if (res.status === 401) {
          return Promise.reject("unathorized");
        } else {
          return res.json();
        }
      })
      .then(parsedRes => {
        this.props.notLoading();
        if (parsedRes.status === "ok") {
          this.setState({
            workouts: parsedRes.workouts
          });
        } else {
          return Promise.reject(parsedRes);
        }
      })
      .catch(error => {
        this.props.notLoading();
        if (error === "unathorized") {
          alert("Please log back in!");
        } else
          alert(
            "Unable to connect to server.  Please check internet connection." +
              error.message
          );
      });
  }

  handleClickVideo = id => {
    // play video in player
  };

  handleClickWorkout = id => {
    let url;

    if (process.env.REACT_APP_TEST) {
      url = `http://localhost:3000/workouts/${id}`;
    } else {
      url = `https://shadowcam-back.herokuapp.com/workouts/${id}`;
    }

    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token}`
      },
      mode: "cors"
    })
      .then(res => {
        if (res.status === 401) {
          return Promise.reject("unathorized");
        } else {
          return res.json();
        }
      })
      .then(parsedRes => {
        this.props.notLoading();
        if (parsedRes.status === "ok") {
          this.setState({
            currentWorkout: parsedRes.workout
          });
        } else {
          return Promise.reject(parsedRes);
        }
      })
      .catch(error => {
        console.log(error);
        this.props.notLoading();
        if (error === "unathorized") {
          alert("Please log back in!");
        } else
          alert(
            "Unable to connect to server.  Please check internet connection." +
              error.message
          );
      });
  };

  render() {
    const displayVideos = () => {
      if (!this.state.currentWorkout) {
        return;
      } else {
        return (
          <Row>
            <Col className={styles.recordedVideosContainer}>
              {this.state.currentWorkout.videos.map(video => {
                return (
                  <div className={styles.recordedVideo} key={video.video_id}>
                    <img
                      src={video.screenShot}
                      alt="Recorded Video"
                      onClick={() => this.handleClickVideo(video.video_id)}
                    />
                  </div>
                );
              })}
            </Col>
          </Row>
        );
      }
    };
    const displayPastWorkouts = () => {
      if (!this.state.workouts) {
        return (
          <Row className={styles.spinnerContainer}>
            <img
              src={loadingSpinner}
              alt="Loading Spinner"
              className={styles.loadingSpinner}
            />
          </Row>
        );
      }

      return this.state.workouts.map(workout => {
        return (
          <Row
            className={styles.workout}
            key={workout.work_id}
            onClick={() => this.handleClickWorkout(workout.work_id)}
          >
            <Col>{workout.work_id}</Col>
            <Col>{Moment(workout.recording_date).format("M/D/YY H:m:s a")}</Col>
            <Col>{formatTimeFromSeconds(workout.workout_length)}</Col>
            <Col>{workout.num_of_intervals}</Col>
            <Col>{workout.interval_length}</Col>
          </Row>
        );
      });
    };

    return (
      <Layout>
        <Container className={styles.pastWorkoutsContainer}>
          <Row>
            <Col className={styles.videoContainer}>
              <video
                src={this.state.currentVideo}
                className={styles.video}
                controls
              />
            </Col>
            <Row className={styles.statContainer}>
              <Col>
                <h3>Stats</h3>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Total Time</div>
                <div>0:00</div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Total Punches</div>
                <div>0</div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Jabs</div>
                <div>0</div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Power Rear Punches</div>
                <div>0</div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Left Hooks</div>
                <div>0</div>
                <div className={styles.label}>Right Hooks</div>
                <div>0</div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Left Uppercuts</div>
                <div>0</div>
                <div className={styles.label}>Right Uppercuts</div>
                <div>0</div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Left Body Hooks</div>
                <div>0</div>
                <div className={styles.label}>Right Body Hooks</div>
                <div>0</div>
              </Col>
            </Row>
          </Row>
          {displayVideos()}
          <Row className={styles.spacer}>
            <h2>Workouts</h2>
          </Row>
          <Row className={styles.workoutsHeader}>
            <Col>ID</Col>
            <Col>Date</Col>
            <Col>Length</Col>
            <Col>Number of Intervals</Col>
            <Col>Interval Length</Col>
          </Row>
          {displayPastWorkouts()}
        </Container>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loading: () => dispatch(loading()),
  notLoading: () => dispatch(notLoading())
});

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading,
  token: state.user.token
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PastWorkoutsPage);
