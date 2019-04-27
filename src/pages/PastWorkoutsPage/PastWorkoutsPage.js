import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import Layout from "../../components/Layout/Layout";

import { loading, notLoading } from "../../store/actions/ui";
import { formatTimeFromSeconds } from "../../utils/utils";

import loadingSpinner from "../../assets/images/loading-spinner.gif";
import styles from "./PastWorkoutsPage.module.css";

export class PastWorkoutsPage extends Component {
  state = {
    currentWorkout: null,
    currentVideo: null,
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
    let url;

    if (process.env.REACT_APP_TEST) {
      url = `http://localhost:3000/videos/${id}.webm`;
    } else {
      url = `https://s3-us-west-1.amazonaws.com/shadowcam-back/${id}.webm`;
    }

    this.setState({
      currentVideo: url
    });
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
          const { stats } = parsedRes.message;
          if (stats) {
            stats.total_punches =
              stats.jab +
              stats.left_body_hook +
              stats.left_hook +
              stats.left_uppercut +
              stats.power_rear +
              stats.right_body_hook +
              stats.right_hook +
              stats.right_uppercut;
            const currentWorkout = parsedRes.message;
            currentWorkout.stats = stats;
            this.setState({
              currentWorkout
            });
          } else {
            alert("No recorded stats for this workout!");
          }
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
                      src={video.screenshot}
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
            <Col>{moment(workout.recording_date).format("M/D/YY h:mm:ss a")}</Col>
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
          <Row className={styles.videoRow}>
            <Col lg={7} className={styles.videoContainer}>
              <video
                src={this.state.currentVideo}
                className={styles.video}
                controls
              />
            </Col>
            <Col lg={5} className={styles.statContainer}>
              <Row>
                <h3 className={styles.statHeader}>Stats</h3>
              </Row>
              <Row className={styles.stat}>
                <Col>Total Time</Col>
                <Col>
                  {this.state.currentWorkout &&
                    formatTimeFromSeconds(
                      this.state.currentWorkout.workout.workout_length
                    )}
                </Col>
              </Row>
              <Row className={styles.stat}>
                <Col xs={4}>Total Punches</Col>
                <Col xs={4}>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.total_punches}
                </Col>
              </Row>
              <Row className={styles.stat}>
                <Col xs={4}>Jabs</Col>
                <Col xs={4} >
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.jab}
                </Col>
              </Row>
              <Row className={styles.stat}>
                <Col xs={4}>Power Rear Punches</Col>
                <Col xs={4}>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.power_rear}
                </Col>
              </Row>
              <Row className={styles.stat}>
                <Col xs={4}>Left Hooks</Col>
                <Col xs={2}>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.left_hook}
                </Col>
                <Col xs={4}>Right Hooks</Col>
                <Col xs={2}>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.right_hook}
                </Col>
              </Row>
              <Row className={styles.stat}>
                <Col xs={4}>Left Uppercuts</Col>
                <Col xs={2}>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.left_uppercut}
                </Col>
                <Col xs={4}>Right Uppercuts</Col>
                <Col xs={2}>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.right_uppercut}
                </Col>
              </Row>
              <Row className={styles.stat}>
                <Col xs={4}>Left Body Hooks</Col>
                <Col xs={2}>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.left_body_hook}
                </Col>
                <Col xs={4}>Right Body Hooks</Col>
                <Col xs={2}>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.right_body_hook}
                </Col>
              </Row>
            </Col>
          </Row>
          {displayVideos()}
          <Row className={styles.spacer}>
            <h2>Workouts</h2>
          </Row>
          <Row className={styles.workoutsHeader}>
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
