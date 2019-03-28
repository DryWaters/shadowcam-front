import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Button } from "reactstrap";
import * as posenet from "@tensorflow-models/posenet";
import Layout from "../../components/Layout/Layout";
import { drawKeyPoints, drawSkeleton } from "../../utils/poseUtils";

import styles from "./NewRecordingPage.module.css";

export class NewRecordingPage extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.state = {
      poseNet: {
        showVideo: true,
        showDebug: false,
        flipHorizontal: true,
        imageScaleFactor: 0.5,
        outputStride: 16,
        minPoseConfidence: 0.1,
        minPartConfidence: 0.5,
        debugColor: "#f45342",
        debugWidth: 5
      },
      width: 640,
      height: 480,
      time: 0,
      totalPunches: 0,
      numJabs: 0,
      numHooks: 0
    };
  }

  componentDidMount() {
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
    if (this.videoRef.current) {
      this.videoRef.current.play();
      this.paintToCanvas();
    }
  };

  componentWillUnmount() {
    this.videoRef.current.pause();
    const tracks = this.currentStream.getTracks();
    tracks.forEach(track => track.stop());
    this.videoRef.current = null;
    this.canvasRef.current = null;
  }

  paintToCanvas = async () => {
    const ctx = this.canvasRef.current.getContext("2d");
    this.canvasRef.current.width = this.state.width;
    this.canvasRef.current.height = this.state.height;
    const net = await posenet.load(0.75);

    const poseDetectionFrame = async () => {
      let poses = [];
      if (this.videoRef.current) {
        const pose = await net.estimateSinglePose(
          this.videoRef.current,
          this.state.poseNet.imageScaleFactor,
          this.state.poseNet.flipHorizontal,
          this.state.poseNet.outputStride
        );
        poses.push(pose);
      }

      ctx.clearRect(0, 0, this.state.width, this.state.height);

      if (this.state.poseNet.showVideo) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-this.state.width, 0);
        if (this.videoRef.current) {
          ctx.drawImage(
            this.videoRef.current,
            0,
            0,
            this.state.width,
            this.state.height
          );
        }
        ctx.restore();
      }

      if (this.state.poseNet.showDebug) {
        poses.forEach(({ score, keypoints }) => {
          if (score > this.state.poseNet.minPoseConfidence) {
            drawKeyPoints(
              keypoints,
              this.state.poseNet.minPartConfidence,
              this.state.poseNet.debugColor,
              ctx
            );
            drawSkeleton(
              keypoints,
              this.state.poseNet.minPartConfidence,
              this.state.poseNet.debugColor,
              this.state.poseNet.debugWidth,
              ctx
            );
          }
        });
      }

      if (this.videoRef.current && !this.videoRef.current.paused) {
        requestAnimationFrame(poseDetectionFrame);
      }
    };

    poseDetectionFrame();
  };

  setRecordingState = () => {
    // if (!this.state.isRecording) {
    //   this.mediaRecorder.start(1000);
    //   this.mediaRecorder.ondataavailable = blob => {
    //     console.log("blob", blob);
    //   };
    // } else {
    //   console.log("should stop!");
    //   this.mediaRecorder.pause();
    // }
    this.setState({
      isRecording: !this.state.isRecording
    });
  };

  toggleShowDebug = () => {
    this.setState(prevState => ({
      poseNet: { ...prevState.poseNet, showDebug: !prevState.poseNet.showDebug }
    }));
  };

  render() {
    return (
      <Layout>
        <Container className={styles.newRecordingContainer}>
          <Row>
            <Col className={styles.debugContainer}>
              <Button onClick={this.toggleShowDebug}>Show Debug Lines</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <video ref={this.videoRef} srcobject={this.currentStream} />
              <canvas
                className={`${styles.canvas} ${
                  this.state.isRecording
                    ? styles.videoRecording
                    : styles.notRecording
                }`}
                ref={this.canvasRef}
              />
            </Col>
          </Row>
          <Row>
            <Col className={styles.videoButtonContainer}>
              <button
                className={styles.button}
                onClick={this.setRecordingState}
              >
                <div
                  className={
                    this.state.isRecording ? styles.stop : styles.record
                  }
                />
              </button>
            </Col>
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
