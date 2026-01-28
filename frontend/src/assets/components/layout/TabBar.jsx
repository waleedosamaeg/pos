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
  SalesScreen: ShoppingCart,
  SalesHistory: FileText,
  Customers: Users,
  CustomerForm: Users,
  CustomerGroups: Users,
  Products: Package,
  ProductForm: Package,
  StockSearch: Package,
  Categories: Package,
  Suppliers: Package,
  PurchaseOrders: FileText,
  LowStock: Package,
  SalesReport: BarChart3,
  DailySummary: BarChart3,
  WeeklySummary: BarChart3,
  MonthlySummary: BarChart3,
  SalesByProduct: BarChart3,
  SalesByCustomer: BarChart3,
  InventoryReport: BarChart3,
  FinancialReport: BarChart3,
  CustomReport: BarChart3,
  Dashboard: Layout,
  Settings: Settings,
  Shortcuts: Keyboard,
  About: Info,
  Payments: FileText,
  Returns: FileText
};

// Tab type to translation key mapping
const tabTranslationKeys = {
  SalesScreen: 'menuItems.newInvoice',
  SalesHistory: 'menuItems.salesHistory',
  Customers: 'menuItems.customers',
  CustomerForm: 'menuItems.newCustomer',
  CustomerGroups: 'menuItems.customerGroups',
  Products: 'menuItems.products',
  ProductForm: 'menuItems.newProduct',
  StockSearch: 'menuItems.stockSearch',
  Categories: 'menuItems.categories',
  Suppliers: 'menuItems.suppliers',
  PurchaseOrders: 'menuItems.purchaseOrders',
  LowStock: 'menuItems.lowStockAlert',
  SalesReport: 'menuItems.salesReports',
  DailySummary: 'menuItems.dailySales',
  WeeklySummary: 'menuItems.weeklySales',
  MonthlySummary: 'menuItems.monthlySales',
  SalesByProduct: 'menuItems.salesByProduct',
  SalesByCustomer: 'menuItems.salesByCustomer',
  InventoryReport: 'menuItems.inventoryReport',
  FinancialReport: 'menuItems.financialReport',
  CustomReport: 'menuItems.customReport',
  Dashboard: 'menuItems.dashboard',
  Settings: 'menuItems.preferences',
  Shortcuts: 'menuItems.keyboardShortcuts',
  About: 'menuItems.aboutApp',
  Payments: 'menuItems.payments',
  Returns: 'menuItems.returns'
};

function TabBar() {
  const { tabs, activeTabId, switchTab, closeTab, openTab } = useTabs();
  const { dispatch: uiDispatch } = useUiContext();
  const { t, i18n } = useTranslation();

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

  // Handle new tab
  const handleNewTab = () => {
    openTab('SalesScreen', t('menuItems.newInvoice'));
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

      {/* New tab button */}
      <button
        onClick={handleNewTab}
        title={t('tabBar.newInvoice')}
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
