import { Modal, ButtonToolbar, Button, SegmentedControl, Placeholder, Text , HStack } from 'rsuite';
import RemindFillIcon from '@rsuite/icons/RemindFill';

import React, { useState } from 'react';
import { useUiContext } from '@context/uiContext.jsx';
import { useTranslation } from 'react-i18next';

const Modall = () => {
    const {state , dispatch} = useUiContext()
    const [open, setOpen] = React.useState(true);
    const [backdrop, setBackdrop] = React.useState('static');
    const {t , i18n } = useTranslation()
    const direction = i18n.language === "ar" ? "rtl" : "ltr"
    
    const handleClose = () => {
        setOpen(false);
        dispatch({type:"remove.modal"})

    };

  return (
    <>

      <Modal backdrop={backdrop} keyboard={true} open={open} onClose={handleClose} style={{direction}}>
        <Modal.Header>
         
          <Modal.Title>{state.modal.title || "Title"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <span>{state.modal.text || "default text"}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            {i18n.language === "ar"  ? "حسناّ"  : "ok"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Modall