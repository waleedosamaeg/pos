import { Modal } from 'rsuite';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Package, X, Keyboard, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useProductSearch from '@hook/useProductSearch';

/**
 * Professional ProductSearch Modal Component
 * Fetches products from backend API with fallback to sample data
 */
export default function ProductSearch({ 
  open, 
  onClose, 
  onSelect, 
  title = null 
}) {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('available');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Use the custom hook for product search
  const { 
    products, 
    categories, 
    isLoading, 
    fetchProducts, 
    getFilteredProducts 
  } = useProductSearch();

  const searchByOptions = [
    { value: 'name', label: t('searchFilters.name') },
    { value: 'sku', label: t('searchFilters.sku') },
    { value: 'barcode', label: t('searchFilters.barcode') },
  ];

  const filteredProducts = getFilteredProducts(searchTerm, searchBy, stockFilter);

  // Reset on open
  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setFocusedIndex(-1);
      setSearchBy('name');
      setSelectedCategory('all');
      setStockFilter('available');
      setIsSearching(false);
      setIsSearched(false);
    }
  }, [open]);

  // Focus input
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  // Scroll to focused item
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-product-item]');
      const focusedElement = items[focusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  // Perform search - fetches from backend using the hook
  const performSearch = useCallback(async () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setIsSearched(true);
      await fetchProducts(searchTerm, selectedCategory, stockFilter);
      setFocusedIndex(0);
      setIsSearching(false);
    }
  }, [searchTerm, selectedCategory, stockFilter, fetchProducts]);

  // Keyboard navigation - Enter always searches, Space/Click selects
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (isSearched && filteredProducts.length > 0) {
          setFocusedIndex(prev => prev < filteredProducts.length - 1 ? prev + 1 : 0);
        }
      }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isSearched && filteredProducts.length > 0) {
          setFocusedIndex(prev => prev > 0 ? prev - 1 : filteredProducts.length - 1);
        }
      }
      else if (e.key === 'Enter') {
        e.preventDefault();
        // Enter always performs search
        if (searchTerm.trim()) {
          performSearch();
        }
      }
      else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        // Space selects the focused item
        if (isSearched && focusedIndex >= 0 && filteredProducts[focusedIndex]) {
          onSelect(filteredProducts[focusedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, focusedIndex, filteredProducts, searchTerm, isSearched, onClose, onSelect, performSearch]);

  const getStockColor = (stock) => {
    if (stock === 0) return 'var(--color-error)';
    if (stock <= 10) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const getStockText = (stock) => {
    if (stock === 0) return t('stockStatus.outOfStock');
    if (stock <= 10) return `${stock} ${t('stockStatus.lowStock')}`;
    return `${stock}`;
  };

  const handleSelectAndClose = (product) => {
    onSelect(product);
    onClose();
  };

  // Custom Select Component
  const CustomSelect = ({ value, onChange, options, minWidth = '100px' }) => (
    <div style={{ position: 'relative', minWidth }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 24px 6px 8px',
          fontSize: '11px',
          borderRadius: '4px',
          border: '1px solid var(--color-border-light)',
          backgroundColor: 'var(--bg-panel)',
          color: 'var(--color-text)',
          cursor: 'pointer',
          appearance: 'none',
          outline: 'none'
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={12} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-muted)' }} />
    </div>
  );

  // Add spin animation for loading spinner
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      size="md" 
      enforceFocus={false}
      style={{ 
        '--modal-width': '650px',
        '--rs-modal-header-bg': 'var(--bg-secondary)',
        '--rs-modal-body-bg': 'var(--bg-secondary)',
      }}
    >
      <style>{spinnerStyle}</style>
      <Modal.Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid var(--color-border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--color-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={14} style={{ color: '#1e293b' }} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>{title || t('sales.productSearch')}</h4>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', borderRadius: '4px', color: 'var(--color-muted)', transition: 'all var(--transition-fast)' }}>
          <X size={14} />
        </button>
      </Modal.Header>
      
      <Modal.Body style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)' }}>
        {/* Filters Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <CustomSelect value={searchBy} onChange={setSearchBy} options={searchByOptions} minWidth="80px" />
          <CustomSelect value={selectedCategory} onChange={setSelectedCategory} options={categories.map(c => ({ value: c, label: c === 'all' ? t('searchFilters.allCategories') : c }))} minWidth="120px" />
          
          {/* Stock Filter Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setStockFilter('available')}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                backgroundColor: stockFilter === 'available' ? 'var(--color-primary)' : 'var(--bg-panel)',
                border: '1px solid ' + (stockFilter === 'available' ? 'var(--color-primary)' : 'var(--color-border-light)'),
                borderRadius: '4px',
                color: stockFilter === 'available' ? '#1e293b' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all var(--transition-fast)'
              }}
            >
              {t('stockStatus.inStock')}
            </button>
            <button
              onClick={() => setStockFilter('unavailable')}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                backgroundColor: stockFilter === 'unavailable' ? 'var(--color-error)' : 'var(--bg-panel)',
                border: '1px solid ' + (stockFilter === 'unavailable' ? 'var(--color-error)' : 'var(--color-border-light)'),
                borderRadius: '4px',
                color: stockFilter === 'unavailable' ? 'white' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all var(--transition-fast)'
              }}
            >
              {t('stockStatus.outOfStock')}
            </button>
          </div>
        </div>

        {/* Search Input with Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            backgroundColor: 'var(--bg-panel)', 
            border: '2px solid ' + (isSearching ? 'var(--color-primary)' : 'var(--color-border-light)'), 
            borderRadius: '6px', 
            padding: '6px 10px'
          }}>
            <Search size={14} style={{ color: isSearching ? 'var(--color-primary)' : 'var(--color-muted)', flexShrink: 0 }} />
            <input 
              ref={searchInputRef} 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder={t('searchFilters.placeholder')} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  performSearch();
                }
              }}
              style={{ 
                flex: 1, 
                border: 'none', 
                outline: 'none', 
                fontSize: '12px', 
                backgroundColor: 'transparent', 
                color: 'var(--color-text)', 
                minWidth: 0,
                padding: '2px 0'
              }} 
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} style={{ color: 'var(--color-muted)' }} />
              </button>
            )}
          </div>
          <button
            onClick={performSearch}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              backgroundColor: 'var(--color-primary)',
              border: 'none',
              borderRadius: '6px',
              color: '#1e293b',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <Search size={14} />
            {t('searchFilters.search')}
          </button>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          style={{ 
            maxHeight: '320px', 
            overflowY: 'auto', 
            padding: '6px',
            backgroundColor: 'var(--bg-panel)',
            borderRadius: '6px',
            border: '1px solid var(--color-border-light)'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--color-muted)' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                border: '2px solid var(--color-border-light)', 
                borderTopColor: 'var(--color-primary)', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                marginBottom: '8px'
              }} />
              <p style={{ fontSize: '12px', margin: 0 }}>{t('loader.text')}</p>
            </div>
          ) : !isSearched ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--color-muted)' }}>
              <Search size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '12px', margin: 0, marginBottom: '4px' }}>{t('searchFilters.enterSearchTerm')}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--color-muted)' }}>
              <Package size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '12px', margin: 0 }}>{t('sales.noProductsFound')}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  data-product-item 
                  onClick={() => handleSelectAndClose(product)} 
                  onMouseEnter={() => setFocusedIndex(index)} 
                  style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    padding: '8px 10px', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    backgroundColor: index === focusedIndex 
                      ? 'var(--bg-row-hover)' 
                      : (stockFilter === 'unavailable' || product.stock === 0 
                          ? 'rgba(220, 53, 69, 0.08)' 
                          : 'transparent'),
                    border: '1px solid ' + (index === focusedIndex 
                      ? 'var(--color-primary)' 
                      : (stockFilter === 'unavailable' || product.stock === 0 
                          ? 'rgba(220, 53, 69, 0.2)' 
                          : 'transparent')),
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {/* Icon */}
                  <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={14} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text)' }}>{product.name}</span>
                      <span style={{ fontSize: '10px', padding: '1px 4px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{product.sku}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', display: 'block' }}>{direction === 'rtl' ? product.ar_usage : product.usage}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text)', marginTop: '0px', display: 'block' }}>${product.sellingPrice.toFixed(2)}</span>
                  </div>
                  
                  {/* Stock */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', fontWeight: '600', color: getStockColor(product.stock), padding: '2px 6px', backgroundColor: getStockColor(product.stock) + '20', borderRadius: '4px', display: 'inline-block' }}>{getStockText(product.stock)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '6px', marginTop: '8px', backgroundColor: 'var(--bg-panel)', borderRadius: '4px', border: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: 'var(--color-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>
              <ArrowUp size={10} />
              <ArrowDown size={10} />
              <span>{t('searchFilters.navigate')}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>
              <span style={{ fontWeight: '600' }}>Ent</span>
              <span>{t('searchFilters.enterSearch')}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px' }}>
              <span style={{ fontWeight: '600' }}>Sp</span>
              <span>{t('searchFilters.select')}</span>
            </span>
          </div>
          <div style={{ fontSize: '9px', color: 'var(--color-muted)' }}>
            {isSearched && filteredProducts.length > 0 && `${filteredProducts.length} ${t('searchFilters.resultsFound')}`}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
