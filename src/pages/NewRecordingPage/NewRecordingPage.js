import React from 'react';
import { connect } from 'react-redux';

export class NewRecordingPage {

  render() {
    return (
      <div>New Session Page</div>
    )
  }
}

export default connect()(NewRecordingPage)