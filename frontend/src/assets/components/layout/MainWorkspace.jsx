import React, { useState, useEffect } from 'react';
import { useTabs } from '@context/TabContext.jsx';

// Import all module components
import SalesInvoice from '@module/sales/SalesInvoice';
import SalesHistory from '@module/sales/SalesHistory';
import Customers from '@module/customers/Customers';
import Products from '@module/inventory/Products';
import AddProduct from '@module/inventory/AddProduct';
import SalesReport from '@module/reports/SalesReport';
import Settings from '@module/settings/Settings';
import Dashboard from '@module/Dashboard';
import Help from '@module/Help';
import Test from "@module/test"

/**
 * Main Workspace Area
 * Renders the content of the currently active tab
 * Handles tab state persistence
 */

// Component registry - maps tab types to components
const componentRegistry = {
  sales: SalesInvoice,
  'sales-history': SalesHistory,
  customers: Customers,
  'new-customer': Customers,
  'customer-form': Customers,
  'customer-groups': Customers,
  products: Products,
  'new-product': AddProduct,
  'product-form': AddProduct,
  'stock-search': Products,
  categories: Products,
  suppliers: Products,
  'purchase-orders': Products,
  'low-stock': Products,
  'report-sales': SalesReport,
  'report-daily': SalesReport,
  'report-weekly': SalesReport,
  'report-monthly': SalesReport,
  'report-sales-product': SalesReport,
  'report-sales-customer': SalesReport,
  'report-inventory': SalesReport,
  'report-financial': SalesReport,
  'report-custom': SalesReport,
  payments: SalesHistory,
  returns: SalesHistory,
  settings: Settings,
  dashboard: Dashboard,
  help: Help,
  shortcuts: Help,
  about: Dashboard,
  'custom-component' : Test
};

// Wrapper component that handles state persistence
function PersistentTabWrapper({ tab, savedState, onSaveState, children }) {
  // Local state initialized from saved state or defaults
  const [localState, setLocalState] = useState(savedState || {});

  // Save state when it changes
  useEffect(() => {
    if (Object.keys(localState).length > 0) {
      onSaveState(tab.id, tab.type, localState);
    }
  }, [localState, tab.id, tab.type, onSaveState]);

  // Provide state setter to children
  const setState = (newState) => {
    if (typeof newState === 'function') {
      setLocalState(prev => {
        const updated = newState(prev);
        return updated;
      });
    } else {
      setLocalState(newState);
    }
  };

  // Pass state and setter to children
  return React.cloneElement(children, {
    tabState: localState,
    setTabState: setState
  });
}

function MainWorkspace() {
  const { tabs, activeTabId, getTabState, saveTabState } = useTabs();

  // Show welcome screen if no tabs
  if (tabs.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        overflow: 'auto',
      }}>
        <Dashboard />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      width: '100%',
      overflow: 'auto',
    }}>
      {/* Render ALL tabs but hide inactive ones */}
      {tabs.map((tab) => {
        const Component = componentRegistry[tab.type];
        
        if (!Component) {
          return null; // Skip unknown tab types
        }

        const isActive = tab.id === activeTabId;
        const savedState = getTabState(tab.id, tab.type);

        return (
          <div 
            key={tab.id}
            style={{ 
              display: isActive ? 'flex' : 'none',
              flexDirection: 'column',
              flex: 1,
              width: '100%',
              overflow: 'auto',
            }}
          >
            {/* Wrap component with state persistence */}
            <PersistentTabWrapper
              tab={tab}
              savedState={savedState}
              onSaveState={saveTabState}
            >
              <Component
                tabId={tab.id}
                isActive={isActive}
                {...tab.props}
              />
            </PersistentTabWrapper>
          </div>
        );
      })}
    </div>
  );
}

export default MainWorkspace;
