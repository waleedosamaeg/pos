import { Modal, ButtonToolbar, Button, SegmentedControl, Placeholder, Text } from 'rsuite';
import React, { useState } from 'react';
import { useAppContext } from '@context/appContext.jsx';

const Modall = () => {
    const {state , dispatch} = useAppContext()
    const [open, setOpen] = React.useState(true);
    const [backdrop, setBackdrop] = React.useState('static');
    const handleClose = () => {
        setOpen(false);
        dispatch({type:"remove.modal"})

    };

  return (
    <>

      <Modal backdrop={backdrop} keyboard={false} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>{state.modal.title || "Title"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h1>{state.modal.body || "Body"}</h1>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Modall