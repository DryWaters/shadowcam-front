import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class RestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: true,
    };
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.props.stopRest}>
          <ModalHeader toggle={this.toggle}>Take a rest!</ModalHeader>
          <ModalBody>
            <div>You deserve a break!</div>
            <div>
              Take a breather for another {this.props.restTime} seconds
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.stopRest}>
              Cancel Break
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default RestModal;
