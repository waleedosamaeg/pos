import React, { useState, useEffect } from 'react';
import { X, Plus, Package, Save, Trash2 } from 'lucide-react';
import { useTabs } from '@context/TabContext.jsx';
import { useUiContext } from '@context/uiContext.jsx';
import { useUserContext } from '@context/userContext.jsx';
import { useTranslation } from 'react-i18next';

/**
 * AddProduct Component - With Tab State Persistence
 * Scrollable centered form with narrow fields
 */
export default function AddProduct({ tabId, isActive, tabState, setTabState }) {
  const { closeTab } = useTabs();
  const { dispatch: uiDispatch } = useUiContext();
  const { state: userState } = useUserContext();
  const { t } = useTranslation();

  // Initialize state from tabState or defaults
  const productData = tabState?.productData || {
    name: '',
    ar_name: '',
    description: '',
    shortcut: '',
    category_id: 1,
    is_active: true,
  };

  const productUnits = tabState?.productUnits || [
    { unit_id: 1, quantity_in_base: 1, selling_price: 0 }
  ];

  const batchData = tabState?.batchData || {
    unit_id: 1,
    expiry_date: '2100-01-01',
    cost_price: 0,
    selling_price: 0,
    stock: 0,
  };

  const errors = tabState?.errors || {};
  const isSubmitting = tabState?.isSubmitting || false;
  const showSuccess = tabState?.showSuccess || false;

  // Available units and categories
  const availableUnits = [
    { id: 1, name: 'Piece', ar_name: 'قطعة' },
    { id: 2, name: 'Kilogram', ar_name: 'كيلوغرام' },
    { id: 3, name: 'Liter', ar_name: 'لتر' },
    { id: 4, name: 'Meter', ar_name: 'متر' },
    { id: 5, name: 'Box', ar_name: 'صندوق' },
    { id: 6, name: 'Pack', ar_name: 'حزمة' },
  ];

  const availableCategories = [
    { id: 1, name: 'General', ar_name: 'عام' },
    { id: 2, name: 'Electronics', ar_name: 'إلكترونيات' },
    { id: 3, name: 'Clothing', ar_name: 'ملابس' },
    { id: 4, name: 'Food & Beverage', ar_name: 'أغذية ومشروبات' },
    { id: 5, name: 'Other', ar_name: 'أخرى' },
  ];

  // Helper function to update state
  const updateState = (updates) => {
    setTabState(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Event handlers
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateState({
      productData: {
        ...productData,
        [name]: type === 'checkbox' ? checked : value,
      },
      errors: {
        ...errors,
        [name]: undefined
      }
    });
  };

  const handleBatchChange = (e) => {
    const { name, value, type } = e.target;
    updateState({
      batchData: {
        ...batchData,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      },
      errors: {
        ...errors,
        [name]: undefined
      }
    });
  };

  const addUnit = () => {
    updateState({
      productUnits: [...productUnits, { unit_id: 1, quantity_in_base: 1, selling_price: 0 }]
    });
  };

  const removeUnit = (index) => {
    updateState({
      productUnits: productUnits.filter((_, i) => i !== index)
    });
  };

  const updateUnit = (index, field, value) => {
    updateState({
      productUnits: productUnits.map((unit, i) => {
        if (i === index) {
          return { ...unit, [field]: field === 'unit_id' ? parseInt(value) || 1 : value };
        }
        return unit;
      })
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!productData.name.trim()) newErrors.name = 'Required';
    if (!productData.ar_name.trim()) newErrors.ar_name = 'Required';
    if (productData.shortcut && productData.shortcut.length > 20) newErrors.shortcut = 'Max 20 chars';
    if (productUnits.length === 0) newErrors.units = 'At least one unit required';

    productUnits.forEach((unit, index) => {
      if (!unit.selling_price || unit.selling_price <= 0) {
        if (!newErrors.unitPrices) newErrors.unitPrices = [];
        newErrors.unitPrices[index] = 'Required';
      }
    });

    if (batchData.stock > 0 && batchData.cost_price <= 0) newErrors.cost_price = 'Required when adding stock';
    if (batchData.stock > 0 && batchData.selling_price <= 0) newErrors.batch_selling_price = 'Required when adding stock';

    const hasErrors = Object.keys(newErrors).filter(key => !key.includes('unitPrices')).length > 0;

    if (hasErrors) {
      updateState({ errors: newErrors });
      return;
    }

    updateState({ isSubmitting: true });

    try {
      const productPayload = {
        ...productData,
        units: productUnits,
        initial_batch: batchData.stock > 0 ? batchData : null,
        created_by: userState?.user?.id || 1
      };

      console.log('Creating product:', productPayload);
      await new Promise(resolve => setTimeout(resolve, 1500));

      updateState({ showSuccess: true, isSubmitting: false });

      setTimeout(() => {
        resetForm();
        updateState({ showSuccess: false });
      }, 2000);
    } catch (error) {
      uiDispatch({
        type: 'modal',
        payload: { title: 'Error', message: 'Failed to create product. Please try again.' }
      });
      updateState({ isSubmitting: false });
    }
  };

  const resetForm = () => {
    updateState({
      productData: { name: '', ar_name: '', description: '', shortcut: '', category_id: 1, is_active: true },
      productUnits: [{ unit_id: 1, quantity_in_base: 1, selling_price: 0 }],
      batchData: { unit_id: 1, expiry_date: '2100-01-01', cost_price: 0, selling_price: 0, stock: 0 },
      errors: {}
    });
  };

  const handleClose = () => {
    const hasData = productData.name || productData.ar_name || productData.description ||
                   productUnits.length > 1 || batchData.stock > 0;
    if (hasData) {
      uiDispatch({
        type: 'confirm',
        payload: {
          title: t('confirm.closeTab.title'),
          message: 'You have unsaved changes. Are you sure you want to close?',
          onConfirm: () => closeTab(tabId)
        }
      });
    } else {
      closeTab(tabId);
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      fontSize: '12px',
    }}>
      {/* Compact Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--color-border-muted)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, var(--color-primary), #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Package size={18} style={{ color: '#1e293b' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '14px',
              fontWeight: '700',
              margin: 0,
              color: 'var(--color-text)',
            }}>
              {t('menuItems.newProduct')}
            </h1>
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{
            padding: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-input)';
            e.currentTarget.style.color = 'var(--color-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-muted)';
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable Form Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          {/* Success Banner */}
          {showSuccess && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ color: '#10b981', fontWeight: '600' }}>Product created successfully!</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--color-border-muted)',
            padding: '14px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--color-border-muted)',
            }}>
              <Package size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                Basic Information
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {/* English Name */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  Product Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleProductChange}
                  placeholder="Enter product name"
                  maxLength="45"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${errors.name ? '#ef4444' : 'var(--color-border-muted)'}`,
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Arabic Name */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  Arabic Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="ar_name"
                  value={productData.ar_name}
                  onChange={handleProductChange}
                  placeholder="أدخل الاسم بالعربية"
                  maxLength="45"
                  dir="rtl"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${errors.ar_name ? '#ef4444' : 'var(--color-border-muted)'}`,
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                    outline: 'none',
                    textAlign: 'right',
                  }}
                />
              </div>

              {/* Shortcut & Category */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  Shortcut Code
                </label>
                <input
                  type="text"
                  name="shortcut"
                  value={productData.shortcut}
                  onChange={handleProductChange}
                  placeholder="e.g., PROD-001"
                  maxLength="20"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${errors.shortcut ? '#ef4444' : 'var(--color-border-muted)'}`,
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  name="category_id"
                  value={productData.category_id}
                  onChange={handleProductChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--color-border-muted)',
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  Description <span style={{ color: 'var(--color-muted)' }}>(Optional)</span>
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleProductChange}
                  placeholder="Enter product description"
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--color-border-muted)',
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Active Toggle */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={productData.is_active}
                    onChange={handleProductChange}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text)' }}>Active Product</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Product Units */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--color-border-muted)',
            padding: '14px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--color-border-muted)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                  Units & Pricing
                </span>
              </div>
              <button
                type="button"
                onClick={addUnit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  backgroundColor: 'var(--color-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#1e293b',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                Add Unit
              </button>
            </div>

            {/* Units List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {productUnits.map((unit, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: '10px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  alignItems: 'end',
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: 'var(--color-muted)', marginBottom: '3px' }}>Unit Type</label>
                    <select
                      value={unit.unit_id}
                      onChange={(e) => updateUnit(index, 'unit_id', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--color-border-muted)',
                        borderRadius: '4px',
                        color: 'var(--color-text)',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      {availableUnits.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.ar_name})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: 'var(--color-muted)', marginBottom: '3px' }}>Qty Base</label>
                    <input
                      type="number"
                      value={unit.quantity_in_base}
                      onChange={(e) => updateUnit(index, 'quantity_in_base', e.target.value)}
                      min="0.001"
                      step="0.001"
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--color-border-muted)',
                        borderRadius: '4px',
                        color: 'var(--color-text)',
                        fontSize: '11px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: 'var(--color-muted)', marginBottom: '3px' }}>
                      Price <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '12px' }}>$</span>
                      <input
                        type="number"
                        value={unit.selling_price}
                        onChange={(e) => updateUnit(index, 'selling_price', e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        style={{
                          width: '100%',
                          padding: '8px 10px 8px 26px',
                          backgroundColor: 'var(--bg-input)',
                          border: `1px solid ${errors.unitPrices && errors.unitPrices[index] ? '#ef4444' : 'var(--color-border-muted)'}`,
                          borderRadius: '4px',
                          color: 'var(--color-text)',
                          fontSize: '11px',
                        }}
                      />
                    </div>
                  </div>

                  {productUnits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      style={{
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--color-muted)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-muted)';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Initial Stock */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--color-border-muted)',
            padding: '14px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--color-border-muted)',
            }}>
              <Package size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                Initial Stock
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>(Optional)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>Stock Qty</label>
                <input
                  type="number"
                  name="stock"
                  value={batchData.stock}
                  onChange={handleBatchChange}
                  min="0"
                  step="0.001"
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--color-border-muted)',
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  Cost Price {batchData.stock > 0 && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  type="number"
                  name="cost_price"
                  value={batchData.cost_price}
                  onChange={handleBatchChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${errors.cost_price ? '#ef4444' : 'var(--color-border-muted)'}`,
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  Selling Price {batchData.stock > 0 && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  type="number"
                  name="selling_price"
                  value={batchData.selling_price}
                  onChange={handleBatchChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${errors.batch_selling_price ? '#ef4444' : 'var(--color-border-muted)'}`,
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={batchData.expiry_date}
                  onChange={handleBatchChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--color-border-muted)',
                    borderRadius: '6px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Compact Footer Actions */}
          <div style={{
            display: 'flex',
            gap: '10px',
            paddingTop: '8px',
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-muted)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-input)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                flex: 2,
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--color-primary), #f59e0b)',
                color: '#1e293b',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-primary), #f59e0b)';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #1e293b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
