import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";

import Layout from "../../components/Layout/Layout";

export class PastRecordingsPage extends Component {
  render() {
    return (
      <Layout>
        <Container>
          <div>
            <h1>Past Recordings Page</h1>
          </div>
        </Container>
      </Layout>
    );
  }
}

export default connect()(PastRecordingsPage);
