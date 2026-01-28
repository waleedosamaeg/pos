import { Modal, ButtonToolbar, Button } from 'rsuite';
import React from 'react';
import { useUiContext } from '@context/uiContext.jsx';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = () => {
    const { state, dispatch } = useUiContext();
    const [open, setOpen] = React.useState(true);
    const { i18n } = useTranslation();
    const direction = i18n.language === "ar" ? "rtl" : "ltr";

    const handleClose = () => {
        setOpen(false);
        dispatch({ type: "remove.confirm" });
    };

    const handleConfirm = () => {
        setOpen(false);
        if (state.confirm?.onConfirm) {
            state.confirm.onConfirm();
        }
        dispatch({ type: "remove.confirm" });
    };

    if (!state.confirm) return null;

    return (
        <Modal backdrop="static" keyboard={true} open={open} onClose={handleClose} style={{ direction }}>
            <Modal.Header>
                <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
                    {state.confirm.title || "Confirm"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <span>{state.confirm.message || "Are you sure?"}</span>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleClose} appearance="default">
                    {i18n.language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleConfirm} appearance="primary" color="red">
                    {i18n.language === "ar" ? "تأكيد" : "Confirm"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDialog;
