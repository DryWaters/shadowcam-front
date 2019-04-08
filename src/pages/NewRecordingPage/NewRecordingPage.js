import debounce from "lodash.debounce";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Button } from "reactstrap";

import Layout from "../../components/Layout/Layout";
import RestModal from "../../components/RestModal/RestModal";
import { formatTimeFromSeconds } from "../../utils/utils";

import * as posenet from "@tensorflow-models/posenet";
import { processPose } from "../../utils/poseUtils";

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
        outputStride: 16
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
      restTimeLeft: props.rest_time,
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

  // setup webcam and recorder
  async componentDidMount() {
    try {
      await this.loadVideo();
      await this.setupRecorder();
      this.setState({
        recorderSetup: true
      });
    } catch (e) {
      console.error("Unable to setup camera");
    }
  }

  // clear recording tracks when leaving page
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

  // start training, start interval counter and start recording
  handleStartTraining = () => {
    const startTimeout = setTimeout(() => {
      const timerInterval = this.startInterval();
      if (this.videoRef.current === null) {
        // already navigated off page just return
        clearInterval(timerInterval);
        return;
      }
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
      restTimeLeft: this.props.rest_time,
      intervalTimeLeft: this.props.interval_length
    });
  };

  // after user has finished rest timer or clicked early cancel rest timer
  handleStopRest = () => {
    this.setState({
      trainingState: "running",
      restTimeLeft: this.props.rest_time
    });

    if (this.state.recorderSetup && this.mediaRecorder.state === "inactive") {
      this.mediaRecorder.start();
    }

    this.processPoses();
  };

  // countdown interval
  startInterval = () => {
    return setInterval(() => {
      if (this.state.totalTimeLeft === 0) {
        this.handleStopTraining();
      } else if (this.state.intervalTimeLeft === 0) {
        this.handleRestTraining();
      } else if (this.state.restTimeLeft === 0) {
        this.handleStopRest();
      } else if (this.state.trainingState === "resting") {
        // if resting do not countdown interval timer,
        // but need to countdown rest timer
        this.setState({
          totalTimeLeft: this.state.totalTimeLeft - 1,
          restTimeLeft: this.state.restTimeLeft - 1
        });
      } else {
        this.setState({
          totalTimeLeft: this.state.totalTimeLeft - 1,
          intervalTimeLeft: this.state.intervalTimeLeft - 1
        });
      }
    }, 1000);
  };

  // if user pauses/resume recording
  handlePauseTraining = () => {
    // if was recording then pause recorder
    if (this.state.recorderSetup && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
      clearInterval(this.state.timerInterval);
      clearTimeout(this.state.startTimeout);
      this.setState({
        trainingState: "paused"
      });
    } else {
      // user wants to resume recording, start recording
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

  // user wants to stop training early
  handleStopTraining = () => {
    if (this.state.trainingState === "done") {
      return;
    }

    this.setState({
      trainingState: "done"
    });

    if (this.state.recorderSetup && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
    }
    clearInterval(this.state.timerInterval);
    clearTimeout(this.state.startTimeout);
  };

  // when interval has stopped running, start rest
  // modal
  handleRestTraining = () => {
    if (this.state.recorderSetup) {
      this.mediaRecorder.stop();
    }
    this.setState({
      intervalTimeLeft: this.props.interval_length,
      trainingState: "resting"
    });
  };

  // if recording video just push blob of video
  // data to current video recording
  recordVideo = blob => {
    this.currentVideo.push(blob.data);
  };

  // create video link that includes the screenshot of the last image
  // of the current video recording
  createVideoLink = () => {
    this.setState(prevState => {
      const currentVideos = [...prevState.videos];
      this.canvasRef.current.width = 160;
      this.canvasRef.current.height = 120;
      this.canvasRef.current
        .getContext("2d")
        .drawImage(this.videoRef.current, 0, 0, 160, 120);
      const videoBlob = new Blob(this.currentVideo, {
        mimeType: "video/webm; codecs=vp9"
      });
      const newVideo = {
        src: window.URL.createObjectURL(videoBlob),
        blob: videoBlob,
        screenshot: this.canvasRef.current
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream"),
        timeStamp: new moment().format(),
        synced: false,
        fileSize: videoBlob.size
      };
      currentVideos.push(newVideo);
      this.currentVideo = [];

      // if done recording then go ahead
      // and upload the videos to backend
      if (this.state.trainingState === "done") {
        this.handleUploadVideo(currentVideos);
        this.handleUploadStats();
      }

      return {
        videos: currentVideos
      };
    });
  };

  // setup webcam only recording video
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

    // once video is running return
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

  // open pose logic for processing a frame from the
  // video element
  processPoses = async () => {
    const net = await posenet.load(0.75);

    // keep the state from updating constantly once it finds
    // a correct punch pose
    // May need to be adjusted later
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

  // play a recorded video on video element
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

  // Upload all videos the backend
  // and update the synce status to true for
  // the videos that are synced
  // Probably will need to add an option to manually
  // upload a video if unable to sync automatically
  handleUploadVideo = videos => {
    Promise.all(
      videos.map(video =>
        this.createUploadRequest(video).then(resp => resp.json())
      )
    ).then(result => this.updateSyncedStatus(result));
  };

  // Update the synced videos status to show
  // the green check mark on the video
  updateSyncedStatus = responses => {
    const newVideos = this.state.videos.slice();

    responses.forEach((response, index) => {
      if (response.status === "ok") {
        newVideos[index].synced = true;
      }
    });

    this.setState({
      videos: newVideos
    });
  };

  // create an fetch request for each video
  createUploadRequest = video => {
    let url;

    const formData = new FormData();
    formData.append("work_id", this.props.work_id);
    formData.append("file_size", video.fileSize);
    formData.append("screenshot", video.screenshot);
    formData.append("video", video.blob);

    if (process.env.REACT_APP_TEST) {
      url = "http://localhost:3000/videos/upload";
    } else {
      url = `https://shadowcam-back.herokuapp.com/videos/upload`;
    }

    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.token}`
      },
      mode: "cors",
      body: formData
    });
  };

  handleUploadStats = () => {
    let url;

    if (process.env.REACT_APP_TEST) {
      url = "http://localhost:3000/stats";
    } else {
      url = `https://shadowcam-back.herokuapp.com/stats`;
    }

    const statData = {
      work_id: this.props.work_id,
      jab: this.state.jab,
      left_body_hook: this.state.leftBodyHook,
      left_hook: this.state.leftHook,
      left_uppercut: this.state.leftUppercut,
      power_rear: this.state.powerRear,
      right_body_hook: this.state.rightBodyHook,
      right_hook: this.state.rightHook,
      right_uppercut: this.state.rightUppercut
    };

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.token}`
      },
      mode: "cors",
      body: JSON.stringify(statData)
    })
      .then(result => result.json())
      .then(parsedRes => console.log(parsedRes));
  };

  render() {
    // Do now show recorder controls if recorder is not
    // setup
    const displayRecordControls = () => {
      if (!this.state.recorderSetup) {
        return;
      }

      // if training has not started yet, allow user to start trying
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
        // else if the training is paused or running allow the user
        // to resume/pause or stop the training
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

    // display the recorded videos after the
    // training is complete
    const displayRecordedVideos = () => {
      return this.state.videos.map(video => {
        return (
          <div className={styles.recordedVideoContainer} key={video.timeStamp}>
            <img
              className={styles.recordedVideo}
              src={video.screenshot}
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
              restTime={this.state.restTimeLeft}
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
                    : ""
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

const mapStateToProps = state => ({
  interval_length: state.workout.interval_length,
  isLoading: state.ui.isLoading,
  num_of_intervals: state.workout.num_of_intervals,
  rest_time: state.workout.rest_time,
  work_id: state.workout.work_id,
  workout_length: state.workout.workout_length,
  token: state.user.token
});

export default connect(mapStateToProps)(NewRecordingPage);
