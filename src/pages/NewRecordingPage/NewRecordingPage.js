import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import * as posenet from '@tensorflow-models/posenet';
import Layout from "../../components/Layout/Layout";
import { drawKeyPoints, drawSkeleton } from '../../utils/poseUtils';

import styles from "./NewRecordingPage.module.css";

export class NewRecordingPage extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.state = {
      showVideo: true,
      width: 640,
      height: 480,
      time: 0,
      totalPunches: 0,
      numJabs: 0,
      numHooks: 0
    };
  }

  componentDidMount() {
    this.setupCamera();
    this.loadVideo();
  }

  setupCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Newer browser required to use ShadowCam");
    }

    this.videoRef.current.width = this.state.width;
    this.videoRef.current.height = this.state.height;

    this.currentStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: this.state.width,
        height: this.state.height
      }
    });

    this.videoRef.current.srcObject = this.currentStream;

    return new Promise(resolve => {
      this.videoRef.current.onloadedmetadata = () => {
        resolve(this.videoRef.current);
      };
    });
  };

  loadVideo = async () => {
    this.videoRef.current = await this.setupCamera();
    this.videoRef.current.play();
  };

  componentWillUnmount() {
    this.videoRef.current.pause();
    const tracks = this.currentStream.getTracks();
    tracks.forEach(track => track.stop());

    this.videoRef.current.srcObject = null;
    this.ctx = null;
  }

  paintToCanvas = async () => {
    this.ctx = this.canvasRef.current.getContext("2d");
    const flipHorizontal = true;
    const imageScaleFactor = 0.5;
    const outputStride = 16;
    const minPoseConfidence = 0.1;
    const minPartConfidence = 0.5;
    this.canvasRef.current.width = this.state.width;
    this.canvasRef.current.height = this.state.height;

    const net = await posenet.load(0.75);

    const poseDetectionFrame = async () => {
      
      let poses = [];
      const pose = await net.estimateSinglePose(
        this.videoRef.current,
        imageScaleFactor,
        flipHorizontal,
        outputStride
      );
      poses.push(pose);

      this.ctx.clearRect(0, 0, this.state.width, this.state.height);

      if (this.state.showVideo) {
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.translate(-this.state.width, 0);
        this.ctx.drawImage(
          this.videoRef.current,
          0,
          0,
          this.state.width,
          this.state.height
        );
        this.ctx.restore();
      }

      poses.forEach(({score, keypoints}) => {
        if (score > minPoseConfidence) {
          drawKeyPoints(keypoints, minPartConfidence, '#000', this.ctx)
          drawSkeleton(keypoints, minPartConfidence, '#000', 6, this.ctx)
        }
      })

      // console.log(poses);
      requestAnimationFrame(poseDetectionFrame);
    };

    poseDetectionFrame();

  };

  setRecordingState = ({ id }) => {
    if (!this.state.isRecording) {
      this.mediaRecorder.start(1000);
      this.mediaRecorder.ondataavailable = blob => {
        console.log("blob", blob);
      };
    } else {
      console.log("should stop!");
      this.mediaRecorder.pause();
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
                srcobject={this.currentStream}
                onCanPlay={this.paintToCanvas}
                style={{ display: "none" }}
              />
              <canvas
                className={
                  this.state.isRecording ? styles.videoRecording : styles.video
                }
                style={{
                  margin: "0 auto",
                  display: "block",
                  maxWidth: "640px",
                  width: "100%"
                }}
                ref={this.canvasRef}
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
