import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import Moment from "moment";
import Layout from "../../components/Layout/Layout";

import styles from "./PastRecordingsPage.module.css";

export class PastRecordingsPage extends Component {
  state = {
    currentVideo: null,
    videos: [
      {
        videoName: "Test Movie",
        src: "http://localhost:3000/videos/testmovie.webm",
        timeStamp: new Moment().format(),
        screenShot: "http://localhost:3000/screenshots/testmovie.png"
      },
      {
        videoName: "Test Movie2",
        src: "http://localhost:3000/videos/testmovie2.webm",
        timeStamp: new Moment().subtract(7, "days").format(),
        screenShot: "http://localhost:3000/screenshots/testmovie2.png"
      }
    ]
  };

  componentDidMount() {
    // fetch user's videos
  }

  handleClickWorkout = timeStamp => {
    const correctVideo = this.state.videos.filter(
      video => video.timeStamp === timeStamp
    );
    this.setState({
      currentVideo: correctVideo[0].src
    });
  };

  render() {
    const displayPastRecordings = () => {
      return this.state.videos.map(video => {
        return (
          <Row
            className={styles.workout}
            key={video.timeStamp}
            onClick={() => this.handleClickWorkout(video.timeStamp)}
          >
            <Col>
              <img
                className={styles.screenShot}
                src={video.screenShot}
                alt={video.videoName}
              />
            </Col>
            <Col>{video.videoName}</Col>
            <Col>{Moment(video.timeStamp).format("M/D/YY H:m:s a")}</Col>
          </Row>
        );
      });
    };

    return (
      <Layout>
        <Container className={styles.pastRecordingsContainer}>
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
                <div className={styles.label}>Hooks</div>
                <div>0</div>
              </Col>
              <Col className={styles.stat}>
                <div className={styles.label}>Uppercuts</div>
                <div>0</div>
              </Col>
            </Row>
          </Row>
          <Row className={styles.spacer}>
            <h2>Workouts</h2>
          </Row>
          {displayPastRecordings()}
        </Container>
      </Layout>
    );
  }
}

export default connect()(PastRecordingsPage);
