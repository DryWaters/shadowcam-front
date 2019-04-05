import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Button } from "reactstrap";
import Layout from "../../components/Layout/Layout";
import RestModal from "../../components/RestModal/RestModal";

import Moment from "moment";
import * as posenet from "@tensorflow-models/posenet";
import debounce from "lodash.debounce";
import { processPose } from "../../utils/poseUtils";
import { formatTimeFromSeconds } from "../../utils/utils";
import styles from "./NewRecordingPage.module.css";

export class NewRecordingPage extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.state = {
      poseNet: {
        flipHorizontal: true,
        imageScaleFactor: 0.5,
        outputStride: 16,
        minPoseConfidence: 0.1,
        minPartConfidence: 0.5
      },
      recorderSetup: false,
      trainingState: "stopped",
      timerInterval: null,
      startTimeout: null,
      ranFirstTime: false,
      width: 640,
      height: 480,
      videos: [],
      totalTimeLeft: props.workout_length,
      intervalTimeLeft: props.interval_length,
      totalPunches: 0,
      jab: 0,
      leftBodyHook: 0,
      leftHook: 0,
      leftUppercut: 0,
      powerRear: 0,
      rightBodyHook: 0,
      rightHook: 0,
      rightUppercut: 0
    };
  }

  async componentDidMount() {
    await this.loadVideo();
    await this.setupRecorder();
    this.setState({
      recorderSetup: true
    });
  }

  componentWillUnmount() {
    this.videoRef.current.pause();
    const tracks = this.currentStream.getTracks();
    tracks.forEach(track => track.stop());
    this.videoRef.current = null;
    this.canvasRef.current = null;
  }

  setupRecorder = async () => {
    this.mediaRecorder = await new MediaRecorder(this.currentStream, {
      mimeType: "video/webm; codecs=vp9"
    });
    this.mediaRecorder.ondataavailable = this.recordVideo;
    this.mediaRecorder.onstop = this.createVideoLink;
    this.currentVideo = [];
  };

  handleStartTraining = () => {
    const startTimeout = setTimeout(() => {
      const timerInterval = this.startInterval();
      if (this.state.recorderSetup && this.mediaRecorder.state === "inactive") {
        this.mediaRecorder.start();
      } else if (this.mediaRecorder.state === "paused") {
        this.mediaRecorder.resume();
      }
      this.processPoses();
      this.setState({
        timerInterval,
        ranFirstTime: true
      });
    }, 5000);

    this.setState({
      trainingState: "running",
      startTimeout,
      intervalTimeLeft: this.props.interval_length
    });
  };

  handleStopRest = () => {
    if (this.state.recorderSetup && this.mediaRecorder.state === "inactive") {
      this.mediaRecorder.start();
    }

    this.processPoses();
    this.setState({
      trainingState: "running",
      intervalTimeLeft: this.props.interval_length
    });
  };

  startInterval = () => {
    return setInterval(() => {
      if (this.state.totalTimeLeft === 0) {
        this.handleStopTraining();
      } else if (this.state.intervalTimeLeft === 0) {
        this.handleRestTraining();
      } else if (this.state.trainingState === "running") {
        this.setState({
          totalTimeLeft: this.state.totalTimeLeft - 1,
          intervalTimeLeft: this.state.intervalTimeLeft - 1
        });
      } else {
        this.setState({
          totalTimeLeft: this.state.totalTimeLeft - 1
        });
      }
    }, 1000);
  };

  handlePauseTraining = () => {
    if (this.state.recorderSetup && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
      clearInterval(this.state.timerInterval);
      clearTimeout(this.state.startTimeout);
      this.setState({
        trainingState: "paused"
      });
    } else {
      const timerInterval = this.startInterval();
      if (this.state.recorderSetup && this.mediaRecorder.state === "inactive") {
        this.mediaRecorder.start();
      } else if (this.mediaRecorder.state === "paused") {
        this.mediaRecorder.resume();
      }
      this.processPoses();
      this.setState({
        timerInterval,
        trainingState: "running",
        ranFirstTime: true
      });
    }
  };

  handleStopTraining = () => {
    if (this.state.trainingState === "done") {
      return;
    }
    if (this.state.recorderSetup && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
    }
    clearInterval(this.state.timerInterval);
    clearTimeout(this.state.startTimeout);
    if (this.state.videos.length > 0) {
      this.handleUploadVideo();
    }
    this.setState({
      trainingState: "done"
    });
  };

  handleRestTraining = () => {
    if (this.state.trainingState === "resting") {
      return;
    }
    if (this.state.recorderSetup) {
      this.mediaRecorder.stop();
    }
    this.setState({
      intervalTimeLeft: this.props.interval_length,
      trainingState: "resting"
    });
  };

  recordVideo = blob => {
    this.currentVideo.push(blob.data);
  };

  createVideoLink = () => {
    this.setState(prevState => {
      const currentVideos = [...prevState.videos];
      this.canvasRef.current.width = 160;
      this.canvasRef.current.height = 120;
      this.canvasRef.current
        .getContext("2d")
        .drawImage(this.videoRef.current, 0, 0, 160, 120);
      const newVideo = {
        src: window.URL.createObjectURL(
          new Blob(this.currentVideo, { mimeType: "video/webm; codecs=vp9" })
        ),
        screenShot: this.canvasRef.current
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream"),
        timeStamp: new Moment().format(),
        synced: false
      };
      currentVideos.push(newVideo);
      this.currentVideo = [];

      return {
        videos: currentVideos
      };
    });
  };

  setupCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Newer browser required to use ShadowCam");
    }
    this.videoRef.current.width = this.state.width;
    this.videoRef.current.height = this.state.height;
    this.currentStream = await navigator.mediaDevices.getUserMedia({
      mimeType: "video/webm; codecs=vp9",
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
    }
  };

  processPoses = async () => {
    const net = await posenet.load(0.75);

    const debounceUpdateState = debounce(punchType => {
      this.setState(prevState => {
        return {
          [punchType]: prevState[punchType] + 1,
          totalPunches: prevState.totalPunches + 1
        };
      });
    }, 100);

    const poseDetectionFrame = async () => {
      let pose;
      if (this.state.recorderSetup) {
        pose = await net.estimateSinglePose(
          this.videoRef.current,
          this.state.poseNet.imageScaleFactor,
          this.state.poseNet.flipHorizontal,
          this.state.poseNet.outputStride
        );
        const punchType = processPose(pose);
        if (punchType && punchType !== "rest") {
          debounceUpdateState(punchType);
        }
      }

      if (this.state.recorderSetup && this.state.trainingState === "running") {
        requestAnimationFrame(poseDetectionFrame);
      }
    };

    poseDetectionFrame();
  };

  handleClickPlayRecordedVideo = timeStamp => {
    this.setState({
      videoState: "playing"
    });
    const correctVideo = this.state.videos.filter(
      video => video.timeStamp === timeStamp
    );
    this.videoRef.current.srcObject = null;
    this.videoRef.current.src = null;
    this.videoRef.current.src = correctVideo[0].src;
    this.videoRef.current.currentTime = 0;
    this.videoRef.current.play();
  };

  handleUploadVideo = () => {
    // fetch POST upload video
    // if successful change to check mark
    // else stay unchecked
  };

  handleUploadStats = () => {
    // fetch POST upload stats
  };

  render() {
    const displayRecordControls = () => {
      if (!this.state.recorderSetup) {
        return;
      }

      if (this.state.trainingState === "stopped") {
        return (
          <Col className={styles.videoButtonContainer}>
            <Button
              className={styles.videoControl}
              onClick={this.handleStartTraining}
            >
              Start Training
            </Button>
          </Col>
        );
      } else if (
        this.state.trainingState === "running" ||
        this.state.trainingState === "paused"
      ) {
        return (
          <Col className={styles.videoButtonContainer}>
            <Button
              disabled={this.mediaRecorder.state === "inactive"}
              className={styles.videoControl}
              onClick={this.handlePauseTraining}
            >
              {this.state.trainingState === "paused" ? "Resume" : "Pause"}
            </Button>
            <Button
              disabled={this.mediaRecorder.state === "inactive"}
              className={styles.videoControl}
              onClick={this.handleStopTraining}
            >
              Stop
            </Button>
          </Col>
        );
      }
    };

    const displayRecordedVideos = () => {
      return this.state.videos.map(video => {
        return (
          <div className={styles.recordedVideoContainer} key={video.timeStamp}>
            <img
              className={styles.recordedVideo}
              src={video.screenShot}
              alt="Recording Video"
              onClick={() => this.handleClickPlayRecordedVideo(video.timeStamp)}
            />
            <div className={styles.videoStatus}>
              {video.synced ? "\u{2705}" : "\u{274C}"}
            </div>
          </div>
        );
      });
    };

    return (
      <Layout>
        <Container className={styles.newRecordingContainer}>
          {this.state.trainingState === "resting" ? (
            <RestModal
              restTime={this.props.rest_time}
              stopRest={this.handleStopRest}
            />
          ) : (
            ""
          )}
          <Row>
            <Col>
              <video
                ref={this.videoRef}
                srcobject={this.currentStream}
                className={`${styles.video} ${
                  this.state.recorderSetup &&
                  this.mediaRecorder.state === "recording"
                    ? styles.videoRecording
                    : styles.notRecording
                }`}
              />
              <div
                className={
                  this.state.trainingState === "running" &&
                  !this.state.ranFirstTime
                    ? styles.countdown
                    : ""
                }
              />
              <canvas className={styles.canvas} ref={this.canvasRef} />
            </Col>
          </Row>
          <Row>{displayRecordControls()}</Row>
          <Row>
            <Col className={styles.recordedVideosContainer}>
              {displayRecordedVideos()}
            </Col>
          </Row>
          <Row className={styles.spacer}>
            <h2>Stats</h2>
          </Row>
          <Row className={styles.spacer}>
            <Col>Total Time:</Col>
            <Col>{formatTimeFromSeconds(this.props.workout_length)}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Total Time Left:</Col>
            <Col>{formatTimeFromSeconds(this.state.totalTimeLeft)}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Interval Time:</Col>
            <Col>{formatTimeFromSeconds(this.props.interval_length)}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Interval Time Left:</Col>
            <Col>{formatTimeFromSeconds(this.state.intervalTimeLeft)}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Punches</Col>
            <Col>{this.state.totalPunches}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Jabs</Col>
            <Col>{this.state.jab}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Power Rear Punches</Col>
            <Col>{this.state.powerRear}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Left Hook Punches</Col>
            <Col>{this.state.leftHook}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Right Hook Punches</Col>
            <Col>{this.state.rightHook}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Left Uppercut Punches</Col>
            <Col>{this.state.leftUppercut}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Right Uppercut Punches</Col>
            <Col>{this.state.rightUppercut}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Left Body Hook Punches</Col>
            <Col>{this.state.leftBodyHook}</Col>
          </Row>
          <Row className={styles.spacer}>
            <Col>Number of Right Body Hook Punches</Col>
            <Col>{this.state.rightBodyHook}</Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({
  workout_length: state.workout.workout_length,
  num_of_intervals: state.workout.num_of_intervals,
  interval_length: state.workout.interval_length,
  rest_time: state.workout.rest_time,
  isLoading: state.ui.isLoading
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewRecordingPage);
