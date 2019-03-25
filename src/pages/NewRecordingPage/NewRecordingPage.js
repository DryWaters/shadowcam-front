import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";

import Layout from "../../components/Layout/Layout";

import styles from "./NewRecordingPage.module.css";

export class NewRecordingPage extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      time: 0,
      totalPunches: 0,
      numJabs: 0,
      numHooks: 0,
      stream: null,
      mediaRecorder: null
    };
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        this.videoRef.current.srcObject = stream;
        this.videoRef.current.play();
        const mediaRecorder = new MediaRecorder(stream);
        this.setState({ stream, mediaRecorder });
      });
  }

  componentWillUnmount() {
    const stream = this.state.stream;
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop());
    this.videoRef.current.srcObject = null;
  }

  setRecordingState = ({id}) => {

    if (!this.state.isRecording) {
      this.state.mediaRecorder.start(1000);
      this.state.mediaRecorder.ondataavailable = blob => {
        console.log("blob", blob);
      };
    } else {
      console.log("should stop!");
      this.state.mediaRecorder.pause();
    }
    this.setState({
      isRecording: !this.state.isRecording
    });
  };

  render() {
    return (
      <Layout>
        <Container className={styles.newRecordingContainer}>
          <Row>
            <Col>
              <video
                className={
                  this.state.isRecording ? styles.videoRecording : styles.video
                }
                ref={this.videoRef}
              />
            </Col>
          </Row>
          <Row className={styles.videoButtons}>
            <button className={styles.button} onClick={this.setRecordingState}>
              <div
                className={this.state.isRecording ? styles.stop : styles.record}
              />
            </button>
          </Row>
          <Row className={styles.spacer}>
            <h2>Stats</h2>
          </Row>
          <Row className={styles.spacer}>
            <Col>Total Time:</Col>
            <Col>{this.state.time}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Punches</Col>
            <Col>{this.state.totalPunches}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Jabs</Col>
            <Col>{this.state.numJabs}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Hooks</Col>
            <Col>{this.state.numHooks}</Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

export default connect()(NewRecordingPage);
