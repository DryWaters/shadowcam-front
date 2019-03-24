import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";

import Layout from "../../components/Layout/Layout";

import styles from "./NewRecordingPage.module.css";

export class NewRecordingPage extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(localMediaStream => {
        this.videoRef.current.srcObject = localMediaStream;
        this.videoRef.current.play();
      });
  }
  render() {
    return (
      <Layout>
        <Container className={styles.newRecordingContainer}>
          <Row className={styles.videoContainer}>
            <Col>
              <video className={styles.video} ref={this.videoRef} />
            </Col>
          </Row>
        </Container>
      </Layout>
    );
  }
}

export default connect()(NewRecordingPage);
