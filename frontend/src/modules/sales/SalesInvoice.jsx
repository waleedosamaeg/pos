import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Save, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  GripVertical, 
  X, 
  ChevronDown, 
  Keyboard, 
  Package 
} from 'lucide-react';
import { useTabs } from '@context/TabContext.jsx';
import { useUiContext } from '@context/uiContext.jsx';
import { useTranslation } from 'react-i18next';
import ProductSearch from '@comp/productSearch.jsx';
import KeyboardShortcuts from '@comp/keyboardShortcuts.jsx';

/**
 * Enhanced Sales Invoice Module - Restructured Layout
 * Row 1: Additional Info Details (invoice number, items, discount, totals)
 * Row 2: Sales Items Table
 */
export default function SalesInvoice({ tabId, isActive, tabState, setTabState }) {
  const { updateTabTitle } = useTabs();
  const { dispatch: uiDispatch } = useUiContext();
  const { t } = useTranslation();
  
  // Ref for focusing on new row inputs
  const newRowInputRef = useRef(null);

  // State management
  const invoiceData = tabState?.invoiceData || {
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    customer: '',
    customerId: null,
    items: [],
    // Discount configuration
    discountType: 'percentage',
    discountValue: 0,
    // Financial totals
    subtotal: 0,
    discountAmount: 0,
    taxableAmount: 0,
    tax: 0,
    total: 0,
    // Statistics
    itemsCount: 0,
    totalItemsQuantity: 0,
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [focusedRowId, setFocusedRowId] = useState(null);
  
  // Table column management
  const [columns, setColumns] = useState([
    { id: 'id', width: 80, visible: true, resizable: true },
    { id: 'name', width: 180, visible: true, resizable: true },
    { id: 'unit', width: 70, visible: true, resizable: true },
    { id: 'quantity', width: 80, visible: true, resizable: true },
    { id: 'price', width: 90, visible: true, resizable: true },
    { id: 'total', width: 90, visible: true, resizable: true },
    { id: 'actions', width: 50, visible: true, resizable: false },
  ]);
  
  const [resizingColumn, setResizingColumn] = useState(null);
  const [draggingColumn, setDraggingColumn] = useState(null);

  // Calculate all financial totals
  const calculateTotals = useCallback((items, discountValue, discountType) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = subtotal * (discountValue / 100);
    } else {
      discountAmount = Math.min(discountValue, subtotal);
    }
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = taxableAmount * 0.15;
    const total = taxableAmount + tax;
    const itemsCount = items.length;
    const totalItemsQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      itemsCount,
      totalItemsQuantity
    };
  }, []);

  // Update state helper
  const updateState = useCallback((updates) => {
    setTabState(prev => ({
      ...prev,
      ...updates
    }));
  }, [setTabState]);

  // Update discount
  const updateDiscount = useCallback((discountValue, discountType) => {
    updateState(prev => {
      const totals = calculateTotals(
        prev.invoiceData.items, 
        discountValue || prev.invoiceData.discountValue, 
        discountType || prev.invoiceData.discountType
      );
      
      return {
        ...prev,
        invoiceData: {
          ...prev.invoiceData,
          discountValue: discountValue !== undefined ? discountValue : prev.invoiceData.discountValue,
          discountType: discountType || prev.invoiceData.discountType,
          ...totals
        }
      };
    });
  }, [updateState, calculateTotals]);

  // Add item to invoice
  const addItem = useCallback((product) => {
    updateState(prev => {
      const existingIndex = prev.invoiceData.items.findIndex(item => item.productId === product.id);
      let newItems;
      if (existingIndex >= 0) {
        newItems = [...prev.invoiceData.items];
        newItems[existingIndex].quantity += 1;
      } else {
        newItems = [...prev.invoiceData.items, {
          productId: product.id,
          name: product.name,
          arName: product.ar_name,
          unit: product.unitName || 'Piece',
          quantity: 1,
          price: parseFloat(product.sellingPrice) || 0,
          total: parseFloat(product.sellingPrice) || 0
        }];
      }

      const totals = calculateTotals(
        newItems, 
        prev.invoiceData.discountValue, 
        prev.invoiceData.discountType
      );
      
      return {
        ...prev,
        invoiceData: {
          ...prev.invoiceData,
          items: newItems,
          ...totals
        }
      };
    });
  }, [updateState, calculateTotals]);

  // Update item quantity
  const updateItemQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    updateState(prev => {
      const newItems = prev.invoiceData.items.map(item => {
        if (item.productId === productId) {
          const total = item.price * quantity;
          return { ...item, quantity, total };
        }
        return item;
      });

      const totals = calculateTotals(
        newItems, 
        prev.invoiceData.discountValue, 
        prev.invoiceData.discountType
      );
      
      return {
        ...prev,
        invoiceData: {
          ...prev.invoiceData,
          items: newItems,
          ...totals
        }
      };
    });
  }, [updateState, calculateTotals]);

  // Remove item
  const removeItem = useCallback((productId) => {
    updateState(prev => {
      const newItems = prev.invoiceData.items.filter(item => item.productId !== productId);
      const totals = calculateTotals(
        newItems, 
        prev.invoiceData.discountValue, 
        prev.invoiceData.discountType
      );
      
      return {
        ...prev,
        invoiceData: {
          ...prev.invoiceData,
          items: newItems,
          ...totals
        }
      };
    });
  }, [updateState, calculateTotals]);

  // Column resizing handlers
  const handleResizeStart = (columnId, e) => {
    e.preventDefault();
    setResizingColumn({
      id: columnId,
      startX: e.clientX,
      startWidth: columns.find(c => c.id === columnId)?.width || 100
    });
  };

  const handleResizeMove = useCallback((e) => {
    if (!resizingColumn) return;
    const diff = e.clientX - resizingColumn.startX;
    const newWidth = Math.max(50, resizingColumn.startWidth + diff);
    
    setColumns(prev => prev.map(col => 
      col.id === resizingColumn.id 
        ? { ...col, width: newWidth }
        : col
    ));
  }, [resizingColumn]);

  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null);
  }, []);

  // Column dragging handlers
  const handleDragStart = (columnId, e) => {
    setDraggingColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggingColumn || draggingColumn === targetColumnId) return;
    
    const draggingIndex = columns.findIndex(c => c.id === draggingColumn);
    const targetIndex = columns.findIndex(c => c.id === targetColumnId);
    
    if (draggingIndex !== targetIndex) {
      const newColumns = [...columns];
      const [removed] = newColumns.splice(draggingIndex, 1);
      newColumns.splice(targetIndex, 0, removed);
      setColumns(newColumns);
    }
  };

  // Complete sale
  const completeSale = useCallback(() => {
    if (invoiceData.items.length === 0) {
      uiDispatch({
        type: 'modal',
        payload: {
          title: 'Error',
          message: 'Please add at least one item to the invoice.',
        }
      });
      return;
    }

    if (!invoiceData.customerId) {
      uiDispatch({
        type: 'modal',
        payload: {
          title: 'Error',
          message: 'Please select a customer.',
        }
      });
      return;
    }

    setIsSubmitting(true);

    const invoicePayload = {
      invoiceNumber: invoiceData.invoiceNumber,
      date: invoiceData.date,
      customerId: invoiceData.customerId,
      items: invoiceData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.total
      })),
      subtotal: invoiceData.subtotal,
      discountType: invoiceData.discountType,
      discountValue: invoiceData.discountValue,
      discountAmount: invoiceData.discountAmount,
      taxableAmount: invoiceData.taxableAmount,
      tax: invoiceData.tax,
      total: invoiceData.total,
      itemsCount: invoiceData.itemsCount,
      totalItemsQuantity: invoiceData.totalItemsQuantity,
    };

    setTimeout(() => {
      uiDispatch({
        type: 'modal',
        payload: {
          title: 'Success',
          message: `Invoice ${invoiceData.invoiceNumber} completed!\n\n💰 Total Earned: $${invoiceData.total}\n📦 Items: ${invoiceData.itemsCount} types (${invoiceData.totalItemsQuantity} units)`,
        }
      });

      const newInvoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      updateState({
        invoiceData: {
          invoiceNumber: newInvoiceNumber,
          date: new Date().toISOString().split('T')[0],
          customer: '',
          customerId: null,
          items: [],
          discountType: 'percentage',
          discountValue: 0,
          subtotal: 0,
          discountAmount: 0,
          taxableAmount: 0,
          tax: 0,
          total: 0,
          itemsCount: 0,
          totalItemsQuantity: 0,
        }
      });

      setIsSubmitting(false);
    }, 1500);
  }, [invoiceData, uiDispatch, updateState]);

  // Event listeners for resizing
  useEffect(() => {
    if (resizingColumn) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingColumn, handleResizeMove, handleResizeEnd]);

  // F1 keyboard shortcut to open product search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F1 - Open product search
      if (e.key === 'F1') {
        e.preventDefault();
        setShowProductSearch(true);
      }
      // ESC - Close search/shortcuts
      if (e.key === 'Escape') {
        if (showProductSearch) {
          setShowProductSearch(false);
        }
        if (showShortcuts) {
          setShowShortcuts(false);
        }
      }
      // Ins - Add new row
      if (e.key === 'Insert' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        insertNewRow();
      }
      // ? - Open shortcuts (Shift+/)
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showProductSearch, showShortcuts]);

  // Insert new empty row
  const insertNewRow = useCallback(() => {
    const newRowId = `temp-${Date.now()}`;
    
    updateState(prev => ({
      ...prev,
      invoiceData: {
        ...prev.invoiceData,
        items: [...prev.invoiceData.items, {
          productId: newRowId,
          isNewRow: true,
          name: '',
          arName: '',
          unit: 'Piece',
          quantity: 1,
          price: 0,
          total: 0
        }]
      }
    }));
    
    setTimeout(() => {
      setFocusedRowId(newRowId);
    }, 0);
  }, [updateState]);

  // Handle product ID input in new rows
  const handleProductIdInput = useCallback((rowId, productId) => {
    updateState(prev => ({
      ...prev,
      invoiceData: {
        ...prev.invoiceData,
        items: prev.invoiceData.items.map(item => 
          item.productId === rowId 
            ? { ...item, productId: productId }
            : item
        )
      }
    }));
  }, [updateState]);

  // Calculate initial totals
  useEffect(() => {
    if (invoiceData.items.length > 0 && invoiceData.subtotal === 0) {
      const totals = calculateTotals(
        invoiceData.items, 
        invoiceData.discountValue, 
        invoiceData.discountType
      );
      updateState({
        invoiceData: {
          ...invoiceData,
          ...totals
        }
      });
    }
  }, []);

  // Info Card Component
  const InfoCard = ({ title, value, color = 'var(--text-primary)', bgColor = 'var(--bg-tertiary)', icon: Icon }) => (
    <div style={{
      padding: '10px 14px',
      backgroundColor: bgColor,
      borderRadius: '8px',
      minWidth: '100px',
      textAlign: 'center',
      border: '1px solid var(--border-color)',
      flex: 1
    }}>
      <p style={{ 
        margin: 0, 
        fontSize: '10px', 
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: '0.5px',
      }}>
        {title}
      </p>
      <p style={{ 
        margin: '6px 0 0', 
        fontSize: '15px', 
        fontWeight: '700',
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }}>
        {Icon && <Icon size={14} />}
        {value}
      </p>
    </div>
  );

  // Render the restructured layout
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: 'var(--bg-secondary)',
    }}>
      
      {/* ROW 1: Additional Info Details */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '12px 16px',
        backgroundColor: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        
        {/* Keyboard Shortcuts Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowShortcuts(true)}
            title={t('shortcuts.title')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              color: 'var(--color-muted)',
            }}
          >
            <Keyboard size={12} />
            <span>?</span>
          </button>
        </div>

        {/* Info Cards Row */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Invoice Number */}
          <InfoCard 
            title={t('sales.invoiceNumber')} 
            value={invoiceData.invoiceNumber} 
            bgColor="rgba(59, 130, 246, 0.1)"
            color="#3b82f6"
          />
          
          {/* Items Count */}
          <InfoCard 
            title={t('sales.itemsCount')} 
            value={invoiceData.itemsCount} 
            bgColor="rgba(16, 185, 129, 0.1)"
            color="#10b981"
          />
          
          {/* Total Units */}
          <InfoCard 
            title={t('sales.totalUnits')} 
            value={invoiceData.totalItemsQuantity} 
            bgColor="rgba(139, 92, 246, 0.1)"
            color="#8b5cf6"
          />
          
          {/* Discount Control */}
          <div style={{
            padding: '10px 14px',
            backgroundColor: invoiceData.discountValue > 0 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
            borderRadius: '8px',
            minWidth: '100px',
            textAlign: 'center',
            border: invoiceData.discountValue > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)',
            flex: 1
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '10px', 
              color: invoiceData.discountValue > 0 ? '#ef4444' : 'var(--color-muted)',
              textTransform: 'uppercase',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}>
              {t('sales.discount')}
            </p>
            <div style={{ 
              margin: '6px 0 0', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}>
              <input
                type="number"
                value={invoiceData.discountValue}
                onChange={(e) => updateDiscount(parseFloat(e.target.value) || 0, invoiceData.discountType)}
                style={{
                  width: '45px',
                  textAlign: 'center',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: invoiceData.discountValue > 0 ? '#ef4444' : 'var(--text-primary)',
                  backgroundColor: invoiceData.discountValue > 0 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                  padding: '4px'
                }}
                min="0"
              />
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '600',
                color: invoiceData.discountValue > 0 ? '#ef4444' : 'var(--color-muted)',
              }}>
                {invoiceData.discountType === 'percentage' ? '%' : '$'}
              </span>
            </div>
          </div>
          
          {/* Discount Amount */}
          <InfoCard 
            title={t('sales.discountAmount')} 
            value={`-$${invoiceData.discountAmount}`}
            bgColor="rgba(239, 68, 68, 0.1)"
            color="#ef4444"
          />
          
          {/* Subtotal */}
          <InfoCard 
            title={t('sales.subtotal')} 
            value={`$${invoiceData.subtotal}`} 
          />
          
          {/* Tax */}
          <InfoCard 
            title={t('sales.tax')} 
            value={`$${invoiceData.tax}`}
            bgColor="rgba(245, 158, 11, 0.1)"
            color="#f59e0b"
          />
          
          {/* Total */}
          <InfoCard 
            title={t('sales.totalEarned')} 
            value={`$${invoiceData.total}`} 
            bgColor="rgba(16, 185, 129, 0.15)"
            color="#10b981"
          />
        </div>

        {/* F1 Search Hint */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
        onClick={() => setShowProductSearch(true)}
        >
          <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
            {t('sales.pressF1Search')}
          </span>
          <kbd style={{
            padding: '2px 6px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            F1
          </kbd>
        </div>
      </div>

      {/* ROW 2: Sales Items Table */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--surface-color)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Table Header */}
        <div 
          style={{
            display: 'flex',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-tertiary)',
            borderBottom: '2px solid var(--border-color)',
            fontWeight: '600',
            fontSize: '11px',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            userSelect: 'none',
          }}
        >
          {/* Insert Button */}
          <div style={{ width: '50px', minWidth: '50px', marginRight: '8px' }}>
            <button
              onClick={insertNewRow}
              title={t('sales.insertRow') + ' (Ins)'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '24px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              ++
            </button>
          </div>
          
          {columns.filter(col => col.visible).map((column) => (
            <div
              key={column.id}
              draggable={column.resizable}
              onDragStart={(e) => handleDragStart(column.id, e)}
              onDragOver={(e) => handleDragOver(e, column.id)}
              style={{
                width: column.width,
                minWidth: column.width,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: column.resizable ? 'grab' : 'default',
                position: 'relative',
              }}
            >
              {column.resizable && (
                <GripVertical size={12} style={{ opacity: 0.5, cursor: 'grab' }} />
              )}
              <span>{t(`sales.columns.${column.id}`)}</span>
              
              {column.resizable && (
                <div
                  onMouseDown={(e) => handleResizeStart(column.id, e)}
                  style={{
                    position: 'absolute',
                    right: '-3px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '6px',
                    height: '16px',
                    backgroundColor: 'var(--color-muted)',
                    borderRadius: '3px',
                    cursor: 'col-resize',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {invoiceData.items.length === 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--color-muted)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <ShoppingCart size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ fontSize: '13px' }}>{t('sales.noItems')}</p>
                <p style={{ fontSize: '11px', marginTop: '4px' }}>{t('sales.pressF1ToAdd')}</p>
              </div>
            </div>
          ) : (
            invoiceData.items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--border-color)',
                  alignItems: 'center',
                  fontSize: '13px',
                  backgroundColor: item.isNewRow ? 'rgba(250, 204, 21, 0.05)' : 'transparent',
                }}
              >
                {/* Product ID Input for New Rows */}
                <div style={{ width: '50px', minWidth: '50px', marginRight: '8px' }}>
                  {item.isNewRow ? (
                    <input
                      ref={focusedRowId === item.productId ? newRowInputRef : null}
                      type="text"
                      placeholder="ID"
                      onChange={(e) => handleProductIdInput(item.productId, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '4px 6px',
                        border: '1px solid var(--color-primary)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textAlign: 'center',
                        backgroundColor: 'var(--bg-tertiary)',
                      }}
                    />
                  ) : (
                    <span style={{ 
                      fontSize: '11px', 
                      color: 'var(--color-muted)',
                      fontFamily: 'monospace' 
                    }}>
                      {item.productId.length > 8 ? item.productId.slice(-8) : item.productId}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <div style={{ width: '180px', minWidth: '180px' }}>
                  <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-primary)' }}>
                    {item.name || (item.isNewRow ? 'New Item' : '')}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--color-muted)' }}>
                    {item.arName}
                  </p>
                </div>

                {/* Unit */}
                <div style={{ width: '70px', minWidth: '70px' }}>
                  <span style={{
                    padding: '3px 6px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                  }}>
                    {item.unit}
                  </span>
                </div>

                {/* Quantity */}
                <div style={{ width: '80px', minWidth: '80px', display: 'flex', gap: '3px' }}>
                  <button
                    onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                    style={{
                      width: '24px',
                      height: '24px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value) || 1)}
                    style={{
                      width: '36px',
                      textAlign: 'center',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      fontSize: '13px',
                    }}
                    min="1"
                  />
                  <button
                    onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                    style={{
                      width: '24px',
                      height: '24px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div style={{ width: '90px', minWidth: '90px' }}>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Total */}
                <div style={{ width: '90px', minWidth: '90px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                    ${item.total.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ width: '50px', minWidth: '50px' }}>
                  <button
                    onClick={() => removeItem(item.productId)}
                    style={{
                      padding: '5px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        padding: '12px 16px',
        backgroundColor: 'var(--surface-color)',
        borderTop: '1px solid var(--border-color)',
      }}>
        <button
          onClick={() => setShowShortcuts(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <Keyboard size={16} />
          {t('shortcuts.title')}
        </button>
        <button
          onClick={completeSale}
          disabled={isSubmitting || invoiceData.items.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            backgroundColor: invoiceData.items.length === 0 ? 'var(--color-muted)' : 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: invoiceData.items.length === 0 ? 'not-allowed' : 'pointer',
            opacity: invoiceData.items.length === 0 ? 0.6 : 1,
          }}
        >
          <DollarSign size={16} />
          {isSubmitting ? t('sales.processing') : t('sales.completeSale')}
        </button>
      </div>

      {/* Product Search Modal */}
      <ProductSearch
        open={showProductSearch}
        onClose={() => setShowProductSearch(false)}
        onSelect={addItem}
        title={t('sales.searchProducts')}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
