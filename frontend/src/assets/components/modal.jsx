import { Modal, Button } from 'rsuite';
import React from 'react';
import { useUiContext } from '@context/uiContext.jsx';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

const Modall = () => {
    const { state, dispatch } = useUiContext();
    const [open, setOpen] = React.useState(true);
    const { i18n } = useTranslation();
    const direction = i18n.language === "ar" ? "rtl" : "ltr";

    const handleClose = () => {
        setOpen(false);
        dispatch({ type: "remove.modal" });
    };

    if (!state.modal) return null;

    return (
        <Modal backdrop="static" keyboard={true} open={open} onClose={handleClose} style={{ direction }}>
            <Modal.Header>
                <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={20} style={{ color: 'var(--color-primary)' }} />
                    {state.modal.title || "Information"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <span>{state.modal.text || "No message"}</span>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleClose} appearance="primary">
                    {i18n.language === "ar" ? "حسناّ" : "OK"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Modall;