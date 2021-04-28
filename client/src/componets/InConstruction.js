import React, { useState } from "react"
import {
  Button,
  Modal,
} from "react-bootstrap"

export default function InConstruction() {
    const [show, setShow] = useState(true);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Under Construction</Modal.Title>
          </Modal.Header>
          <Modal.Body>Currently you are viewing the test website. None of the presented stats are correct. Also the payment methods are all in testing, so no real donations will go anywhere.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }