import { Modal } from 'rsuite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Keyboard, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  X,
  FileText
} from 'lucide-react';

/**
 * KeyboardShortcuts Component
 * Displays a modal with all available keyboard shortcuts
 */
export default function KeyboardShortcuts({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Shortcut groups
  const shortcutGroups = [
    {
      title: t('shortcuts.general'),
      shortcuts: [
        { key: 'F1', description: t('shortcuts.searchProducts'), icon: Search },
        { key: 'ESC', description: t('shortcuts.closeModal'), icon: X },
      ]
    },
    {
      title: t('shortcuts.invoice'),
      shortcuts: [
        { key: 'Ins', description: t('shortcuts.insertRow'), icon: Plus },
        { key: 'Del', description: t('shortcuts.deleteRow'), icon: Trash2 },
        { key: 'Ctrl+S', description: t('shortcuts.saveInvoice'), icon: Save },
        { key: 'Ctrl+Enter', description: t('shortcuts.completeSale'), icon: DollarSign },
      ]
    },
    {
      title: t('shortcuts.navigation'),
      shortcuts: [
        { key: '↑', description: t('shortcuts.previousItem'), icon: ArrowUp },
        { key: '↓', description: t('shortcuts.nextItem'), icon: ArrowDown },
        { key: 'Tab', description: t('shortcuts.nextField'), icon: FileText },
      ]
    }
  ];

  if (!open) return null;

  return (
    <Modal 
      backdrop="static" 
      keyboard={true} 
      open={open} 
      onClose={onClose}
      style={{ direction, marginTop: '50px' }}
      size="md"
    >
      {/* Header */}
      <Modal.Header>
        <Modal.Title style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          <Keyboard size={20} style={{ color: 'var(--color-primary)' }} />
          {t('shortcuts.title')}
        </Modal.Title>
      </Modal.Header>

      {/* Shortcuts List */}
      <Modal.Body style={{ padding: '16px 20px' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}>
          {shortcutGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Group Title */}
              <h4 style={{ 
                margin: '0 0 10px 0',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--color-muted)',
                paddingBottom: '6px',
                borderBottom: '1px solid var(--border-color)'
              }}>
                {group.title}
              </h4>
              
              {/* Shortcuts */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '8px'
              }}>
                {group.shortcuts.map((shortcut, shortcutIndex) => {
                  const Icon = shortcut.icon;
                  return (
                    <div 
                      key={shortcutIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={14} style={{ color: 'var(--color-primary)' }} />
                      </div>
                      
                      {/* Description */}
                      <span style={{ 
                        flex: 1, 
                        fontSize: '12px', 
                        color: 'var(--text-primary)' 
                      }}>
                        {shortcut.description}
                      </span>
                      
                      {/* Key */}
                      <kbd style={{
                        padding: '3px 8px',
                        backgroundColor: 'var(--surface-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        fontFamily: 'monospace',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap'
                      }}>
                        {shortcut.key}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div style={{
          marginTop: '16px',
          padding: '10px 12px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: 'var(--color-primary)'
        }}>
          <Keyboard size={14} />
          <span>{t('shortcuts.pressF1Tip')}</span>
        </div>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer style={{ padding: '10px 16px' }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 20px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {t('shortcuts.close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
