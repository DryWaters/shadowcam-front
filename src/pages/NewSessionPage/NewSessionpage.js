import React from 'react';
import { connect } from 'react-redux';

export class NewSessionPage {

  render() {
    return (
      <div>New Session Page</div>
    )
  }
}

export default connect()(NewSessionPage)