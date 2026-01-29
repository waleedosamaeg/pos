import React from 'react';
import { useTabs } from '@context/TabContext.jsx';
import { useUiContext } from '@context/uiContext.jsx';
import { useTranslation } from 'react-i18next';
import {
  X,
  FileText,
  ShoppingCart,
  Users,
  Package,
  PackagePlus,
  BarChart3,
  Settings,
  Info,
  Keyboard,
  Layout,
  Plus
} from 'lucide-react';

/**
 * Modern Tab Bar Component
 * Professional ERP-style tabs with theme switching
 */

// Icon mapping for different tab types
const tabIcons = {
  sales: ShoppingCart,
  'sales-history': FileText,
  customers: Users,
  'customer-form': Users,
  'customer-groups': Users,
  'products': Package,
  'product-form': Package,
  'new-product': PackagePlus,
  'stock-search': Package,
  categories: Package,
  suppliers: Package,
  'purchase-orders': FileText,
  'low-stock': Package,
  'report-sales': BarChart3,
  'report-daily': BarChart3,
  'report-weekly': BarChart3,
  'report-monthly': BarChart3,
  'report-sales-product': BarChart3,
  'report-sales-customer': BarChart3,
  'report-inventory': BarChart3,
  'report-financial': BarChart3,
  'report-custom': BarChart3,
  payments: FileText,
  returns: FileText,
  settings: Settings,
  shortcuts: Keyboard,
  dashboard: Layout,
  // help: Help,
  about: Info,
};

// Tab type to translation key mapping
const tabTranslationKeys = {
  sales: 'menuItems.newInvoice',
  'sales-history': 'menuItems.salesHistory',
  customers: 'menuItems.customers',
  'customer-form': 'menuItems.newCustomer',
  'customer-groups': 'menuItems.customerGroups',
  'products': 'menuItems.products',
  'product-form': 'menuItems.newProduct',
  'new-product': 'menuItems.newProduct',
  'stock-search': 'menuItems.stockSearch',
  categories: 'menuItems.categories',
  suppliers: 'menuItems.suppliers',
  'purchase-orders': 'menuItems.purchaseOrders',
  'low-stock': 'menuItems.lowStockAlert',
  'report-sales': 'menuItems.salesReports',
  'report-daily': 'menuItems.dailySales',
  'report-weekly': 'menuItems.weeklySales',
  'report-monthly': 'menuItems.monthlySales',
  'report-sales-product': 'menuItems.salesByProduct',
  'report-sales-customer': 'menuItems.salesByCustomer',
  'report-inventory': 'menuItems.inventoryReport',
  'report-financial': 'menuItems.financialReport',
  'report-custom': 'menuItems.customReport',
  payments: 'menuItems.payments',
  returns: 'menuItems.returns',
  settings: 'menuItems.preferences',
  shortcuts: 'menuItems.keyboardShortcuts',
  dashboard: 'menuItems.dashboard',
  help: 'menuItems.help',
  about: 'menuItems.aboutApp',
};

function TabBar() {
  const { tabs, activeTabId, switchTab, closeTab, openTab } = useTabs();
  const { dispatch: uiDispatch } = useUiContext();
  const { t, i18n } = useTranslation();
  const [showQuickActions, setShowQuickActions] = React.useState(false);

  // Function to get translated tab title
  const getTabTitle = (tab) => {
    const translationKey = tabTranslationKeys[tab.type];
    if (translationKey) {
      return t(translationKey);
    }
    return tab.title;
  };

  // Handle tab close with confirmation
  const handleClose = (e, tabId) => {
    e.stopPropagation();
    const tab = tabs.find(t => t.id === tabId);
    
    uiDispatch({
      type: 'confirm',
      payload: {
        title: t('confirm.closeTab.title'),
        message: `${t('confirm.closeTab.message')} "${tab?.title}"?`,
        onConfirm: () => {
          closeTab(tabId);
        }
      }
    });
  };

  // Quick actions menu items
  const quickActions = [
    {
      icon: ShoppingCart,
      label: t('menuItems.newInvoice'),
      action: () => openTab('sales', t('menuItems.newInvoice'))
    },
   
    {
      icon: PackagePlus,
      label: t('menuItems.newProduct'),
      action: () => openTab('product-form', t('menuItems.newProduct'))
    },
    {
      icon: Users,
      label: t('menuItems.newCustomer'),
      action: () => openTab('customer-form', t('menuItems.newCustomer'))
    },
    {
      icon: FileText,
      label: t('menuItems.salesHistory'),
      action: () => openTab('sales-history', t('menuItems.salesHistory'))
    },
    {
      icon: Package,
      label: t('menuItems.products'),
      action: () => openTab('products', t('menuItems.products'))
    },
    {
      icon: Users,
      label: t('menuItems.customers'),
      action: () => openTab('customers', t('menuItems.customers'))
    },
    {
      icon: BarChart3,
      label: t('menuItems.salesReports'),
      action: () => openTab('report-sales', t('menuItems.salesReports'))
    },
    {
      icon: Settings,
      label: t('menuItems.preferences'),
      action: () => openTab('settings', t('menuItems.preferences'))
    }
  ];

  // Handle quick action selection
  const handleQuickAction = (action) => {
    action();
    setShowQuickActions(false);
  };

  // Handle new tab
  const handleNewTab = () => {
    setShowQuickActions(!showQuickActions);
  };

  return (
    <div 
      style={{
        display: 'flex',
        overflow : "auto",
        alignItems: 'stretch',
        height: '44px',
        userSelect: 'none',
        backgroundColor: 'var(--tab-bg)',
        borderBottom: '1px solid var(--tab-border)',
        gap: '4px',
        padding: '4px 8px',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* Tab scroll area */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          overflowX: 'auto',
          gap: '6px',
        }}
      >
        {tabs.length === 0 ? (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '16px',
              fontSize: '12px',
              fontStyle: 'italic',
              color: 'var(--color-muted)',
            }}
          >
            {t('tabBar.noDocuments')}
          </div>
        ) : (
          tabs.map((tab) => {
            const IconComponent = tabIcons[tab.type] || FileText;
            const isActive = tab.id === activeTabId;
            const displayTitle = getTabTitle(tab);

            return (
              <div
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                title={displayTitle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  minWidth: '120px',
                  maxWidth: '220px',
                  backgroundColor: isActive ? 'var(--tab-active)' : 'transparent',
                  color: isActive ? 'var(--tab-text-active)' : 'var(--tab-text)',
                  border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--tab-border)'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  group: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(250, 204, 21, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--tab-border)';
                  }
                }}
              >
                {/* Tab icon */}
                <IconComponent 
                  size={16} 
                  style={{ 
                    flexShrink: 0,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-muted-light)',
                    transition: 'color var(--transition-fast)',
                  }}
                />
                
                {/* Tab title */}
                <span 
                  style={{
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '12px',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? 'var(--tab-text-active)' : 'var(--tab-text)',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {displayTitle}
                </span>

                {/* Close button */}
                <button
                  onClick={(e) => handleClose(e, tab.id)}
                  title={t('tabBar.closeTab')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    padding: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-muted)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all var(--transition-fast)',
                    opacity: isActive ? 1 : 0,
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
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Divider */}
      {tabs.length > 0 && (
        <div 
          style={{
            width: '1px',
            backgroundColor: 'var(--tab-border)',
            margin: '4px 0',
          }}
        />
      )}

      {/* New tab button with quick actions modal */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleNewTab}
          title={t('tabBar.newTab')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 10px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-input)';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-muted)';
          }}
        >
          <Plus size={16} />
        </button>

        {/* Quick Actions Modal */}
        {showQuickActions && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '9999',
            }}
            onClick={() => setShowQuickActions(false)}
          >
            {/* Modal Content */}
            <div
              style={{
                backgroundColor: 'var(--surface-color)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                minWidth: '320px',
                maxWidth: '400px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Plus size={20} style={{ color: 'var(--color-primary)' }} />
                  {t('tabBar.quickActions')}
                </h3>
                <button
                  onClick={() => setShowQuickActions(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--color-muted)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--color-danger)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-muted)';
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div
                style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        borderRadius: '10px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.color = 'var(--color-primary)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <IconComponent size={20} style={{ color: 'var(--color-primary)' }} />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '12px 20px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <button
                  onClick={() => setShowQuickActions(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {t('buttons.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab count indicator */}
      {tabs.length > 0 && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '8px',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: 'var(--color-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          {tabs.length}
        </div>
      )}
    </div>
  );
}

export default TabBar;
