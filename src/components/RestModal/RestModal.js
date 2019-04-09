import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const RestModal = props => (
  <div>
    <Modal isOpen>
      <ModalHeader>Take a rest!</ModalHeader>
      <ModalBody>
        <div>You deserve a break!</div>
        <div>Take a breather for another {props.restTime} seconds!</div>
      </ModalBody>
    </Modal>
  </div>
);

export default RestModal;
