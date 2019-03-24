import React, { Component } from "react";
import { connect } from "react-redux";

export class NewRecordingPage extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(localMediaStream => {
        this.videoRef.srcObject = localMediaStream;
        this.videoRef.play();
      })
  }
  render() {
    return (
      <div>
        <p>New RecordingPage</p>
        <video ref={this.videoRef} />
      </div>
    );
  }
}

export default connect()(NewRecordingPage);
