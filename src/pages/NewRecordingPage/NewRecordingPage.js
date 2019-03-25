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
      isRecording: false
    };
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        this.videoRef.current.srcObject = stream;
        this.videoRef.current.play();
      });
  }

  componentWillUnmount() {
    const stream = this.videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop());
    this.videoRef.current.srcObject = null;
  }

  toggleRecording = () => {
    this.setState({
      isRecording: !this.state.isRecording
    })
  }
  render() {
    return (
      <Layout>
        <Container className={styles.newRecordingContainer}>
          <Row>
            <Col>
              <video className={this.state.isRecording ? styles.videoRecording : styles.video} ref={this.videoRef} />
            </Col>
          </Row>
          <Row className={styles.videoButtons}>
            <button className={styles.button} onClick={this.toggleRecording}>
              <div className={this.state.isRecording ? styles.stop : styles.record} />
            </button>
          </Row>
          <Row className={styles.spacer}>
            <h2>Statistics</h2>
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
