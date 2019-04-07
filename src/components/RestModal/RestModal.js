import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const RestModal = props => (
  <div>
    <Modal isOpen toggle={props.stopRest}>
      <ModalHeader>Take a rest!</ModalHeader>
      <ModalBody>
        <div>You deserve a break!</div>
        <div>Take a breather for another {props.restTime} seconds!</div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props.stopRest}>
          Cancel Break
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default RestModal;
