import React from 'react';
import { useTabs } from '@context/TabContext.jsx';

// Import all module components
import SalesInvoice from '@/modules/sales/SalesInvoice';
import SalesHistory from '@/modules/sales/SalesHistory';
import Customers from '@/modules/customers/Customers';
import Products from '@/modules/inventory/Products';
import SalesReport from '@/modules/reports/SalesReport';
import Settings from '@/modules/settings/Settings';
import Dashboard from '@/modules/Dashboard';
import Help from '@/modules/Help';

/**
 * Main Workspace Area
 * Renders the content of the currently active tab
 */

// Component registry - maps tab types to components
const componentRegistry = {
  sales: SalesInvoice,
  'sales-history': SalesHistory,
  customers: Customers,
  'new-customer': Customers,
  'products': Products,
  'new-product': Products,
  'report-sales': SalesReport,
  'report-daily': SalesReport,
  'report-weekly': SalesReport,
  'report-monthly': SalesReport,
  'report-sales-product': SalesReport,
  'report-sales-customer': SalesReport,
  'report-inventory': SalesReport,
  'report-financial': SalesReport,
  'report-custom': SalesReport,
  settings: Settings,
  dashboard: Dashboard,
  help: Help,
  about: Dashboard,
};

function MainWorkspace() {
  const { tabs, activeTabId } = useTabs();

  // Get the active tab
  const activeTab = tabs.find(t => t.id === activeTabId);

  // Show welcome screen if no tabs
  if (!activeTab) {
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

  // Get the component for this tab type
  const Component = componentRegistry[activeTab.type];

  if (!Component) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
      }}>
        <div style={{ textAlign: 'center', color: 'var(--color-muted-light)' }}>
          <p>Unknown module: {activeTab.type}</p>
        </div>
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
      <Component 
        tabId={activeTab.id} 
        isActive={true}
        {...activeTab.props} 
      />
    </div>
  );
}

export default MainWorkspace;
