import React from 'react'
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmation = ({ showModal, confirmModal, hideModal, message }) => {
  const handleClose = () => {
    setTimeout(() => hideModal(), 250);
  }

  return (
    <Modal
      show={showModal}
      centered
      style={{ opacity: 1, paddingTop: '200px' }}
      size="sm">
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>{'Confirm deletion'}</Modal.Title>
      </Modal.Header>
      <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirmModal}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteConfirmation;

