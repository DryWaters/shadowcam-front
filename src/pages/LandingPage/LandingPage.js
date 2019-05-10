import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Container, Col, Row } from "reactstrap";
import Layout from "../../components/Layout/Layout";

import { loadToken } from "../../store/actions/user";

import brainLifting from "../../assets/images/brain-lifting.jpg";
import screen1 from "../../assets/images/screenshot_1.jpg";
import screen2 from "../../assets/images/screenshot_2.jpg";
import styles from "./LandingPage.module.css";
import uploadVideo from "../../assets/images/upload-video.jpg";

export class LandingPage extends Component {
  componentDidMount() {
    // if localstorage is available and has a token saved. Load it
    if (localStorage && localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const expiresIn = localStorage.getItem("expiresIn");
      if (moment(expiresIn) > moment()) {
        this.props.loadToken(token, expiresIn);
      }
    }
  }

  render() {
    return (
      <Layout>
        <Container className={styles.landingContainer}>
          <Row className={styles.contentRow}>
            <Col>
              <h1 className={`${styles.highlightColor} ${styles.category}`}>
                ShadowCam
              </h1>
            </Col>
          </Row>
          <Row className={styles.contentRow}>
            <Col>
              <p>
                ShadowCam harnesses the power of machine learning, neural
                networks, and millions of images to take your boxing workout to
                the next level!
              </p>
            </Col>
          </Row>
          <Row className={styles.contentRow}>
            <Col>
              <p>
                <Link to="/account/create">
                  <Button className={styles.signupButton}>Start</Button>
                </Link>
                your account now!
                <span className={styles.highlightColor}> It's free!</span>
              </p>
            </Col>
          </Row>
          <Row className={styles.contentRow}>
            <Col>
              <h2 className={`${styles.highlightColor} ${styles.subCategory}`}>
                Training with ShadowCam
              </h2>
              <h3>How does it work?</h3>
            </Col>
          </Row>
          <Row className={styles.contentRow}>
            <Col sm={6}>
              {/* <img
                className={styles.screenshots}
                src={screen2}
                alt="Screenshot of app"
              /> */}
              <iframe
                title="demo_video"
                width="560"
                height="315"
                src="https://www.youtube.com/embed/o0wxXZ4AA30"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </Col>
            <Col sm={5}>
              <p>
                Using only your webcam and a laptop, ShadowCam is able to
                recognize your poses and then calculate and track vital workout
                statistics such as number of punches and interval tracking.
              </p>
              <Link to="/account/create">
                <Button className={styles.signupButton}>Sign Up!</Button>
              </Link>
            </Col>
          </Row>
          <Row className={styles.contentRow}>
            <Col>
              <p>
                ShadowCam uses the power of TensorFlow.js and PoseNet to
                accurately predict your location without the use of powerful
                GPUs.
              </p>
              <Link to="/account/create">
                <Button className={styles.signupButton}>Sign Up!</Button>
              </Link>
            </Col>
            <Col>
              <img
                className={styles.screenshots}
                src={screen1}
                alt="Screenshot of app"
              />
            </Col>
          </Row>
          <Row className={styles.contentRow}>
            <Col>
              <h2 className={`${styles.highlightColor} ${styles.subCategory}`}>
                Simple to Use
              </h2>
            </Col>
          </Row>
          <Row className={styles.contentRow}>
            <Col>
              <img
                className={styles.screenshots}
                src={brainLifting}
                alt="Screenshot of app"
              />
            </Col>
            <Col>
              <p>
                After signing up for the free to use service, you only need to
                start a new recording to begin your workout. ShadowCam's
                algorithms will take over from there and begin processing and
                displaying statistics that are important to you.
              </p>
              <Link to="/account/create">
                <Button className={styles.signupButton}>Sign Up!</Button>
              </Link>
            </Col>
          </Row>
          <Row className={styles.contentRow}>
            <Col>
              <p>
                To ensure none of your sessions are lost, ShadowCam also offers
                the ability to save and sync your workouts into the cloud. This
                gives you the power to view your workout from anywhere: on a
                train, on a plane, or at the gym.
              </p>
              <Link to="/account/create">
                <Button className={styles.signupButton}>Sign Up!</Button>
              </Link>
            </Col>
            <Col>
              <img
                className={styles.screenshots}
                src={uploadVideo}
                alt="Screenshot of app"
              />
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadToken: (token, expiresIn) => dispatch(loadToken(token, expiresIn))
});

export default connect(
  null,
  mapDispatchToProps
)(LandingPage);
