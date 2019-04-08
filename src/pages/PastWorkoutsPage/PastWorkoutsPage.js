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
    this.setState({
      currentVideo: `http://localhost:3000/videos/${id}.webm`
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
            <Col>{moment(workout.recording_date).format("M/D/YY H:m:s a")}</Col>
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
                <div>
                  {this.state.currentWorkout &&
                    formatTimeFromSeconds(
                      this.state.currentWorkout.workout.workout_length
                    )}
                </div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Total Punches</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.total_punches}
                </div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Jabs</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.jab}
                </div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Power Rear Punches</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.power_rear}
                </div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Left Hooks</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.left_hook}
                </div>
                <div className={styles.label}>Right Hooks</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.right_hook}
                </div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Left Uppercuts</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.left_uppercut}
                </div>
                <div className={styles.label}>Right Uppercuts</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.right_uppercut}
                </div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Left Body Hooks</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.left_body_hook}
                </div>
                <div className={styles.label}>Right Body Hooks</div>
                <div>
                  {this.state.currentWorkout &&
                    this.state.currentWorkout.stats.right_body_hook}
                </div>
              </Col>
            </Row>
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
