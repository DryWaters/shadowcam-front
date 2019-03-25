import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from 'reactstrap';

import Layout from "../../components/Layout/Layout";

export class PastRecordingsPage extends Component {
  render() {
    return (
      <Layout>
        <Container>
          <div>Past Recordings Page</div>
        </Container>
      </Layout>
    );
  }
}

export default connect()(PastRecordingsPage);
