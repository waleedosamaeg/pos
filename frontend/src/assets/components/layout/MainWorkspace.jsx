import React from 'react';
import { useTabs } from '@context/TabContext.jsx';
// import SalesScreen from '../Modules/Sales/SalesScreen';
import GenericModule from '@comp/common/GenericModule.jsx';

/**
 * Main Workspace Area
 * Renders the content of the currently active tab
 */

// Component registry - maps tab types to components
const componentRegistry = {
  SalesScreen: <h1>Sales Component</h1>,
  // All other modules use a generic placeholder for now
  SalesHistory: (props) => <GenericModule title="Sales History" description="View and manage past sales transactions" {...props} />,
  Customers: (props) => <GenericModule title="Customers" description="Customer management and CRM" {...props} />,
  CustomerForm: (props) => <GenericModule title="New Customer" description="Add a new customer to the system" {...props} />,
  CustomerGroups: (props) => <GenericModule title="Customer Groups" description="Manage customer segments and groups" {...props} />,
  Payments: (props) => <GenericModule title="Payments" description="Payment processing and history" {...props} />,
  Returns: (props) => <GenericModule title="Returns" description="Process returns and refunds" {...props} />,
  Products: (props) => <GenericModule title="Products" description="Product catalog management" {...props} />,
  ProductForm: (props) => <GenericModule title="New Product" description="Add a new product to inventory" {...props} />,
  StockSearch: (props) => <GenericModule title="Stock Search" description="Search inventory across all locations" {...props} />,
  Categories: (props) => <GenericModule title="Categories" description="Product category management" {...props} />,
  Suppliers: (props) => <GenericModule title="Suppliers" description="Supplier management" {...props} />,
  PurchaseOrders: (props) => <GenericModule title="Purchase Orders" description="Create and manage purchase orders" {...props} />,
  LowStock: (props) => <GenericModule title="Low Stock Alert" description="Products below minimum stock levels" {...props} />,
  SalesReport: (props) => <GenericModule title="Sales Report" description="Detailed sales analytics and trends" {...props} />,
  DailySummary: (props) => <GenericModule title="Daily Sales" description="Today's sales overview and transactions" {...props} />,
  WeeklySummary: (props) => <GenericModule title="Weekly Sales" description="This week's sales performance" {...props} />,
  MonthlySummary: (props) => <GenericModule title="Monthly Sales" description="Monthly sales trends and comparison" {...props} />,
  SalesByProduct: (props) => <GenericModule title="Sales by Product" description="Product-wise sales breakdown" {...props} />,
  SalesByCustomer: (props) => <GenericModule title="Sales by Customer" description="Customer-wise sales analysis" {...props} />,
  InventoryReport: (props) => <GenericModule title="Inventory Report" description="Stock levels and movement analysis" {...props} />,
  FinancialReport: (props) => <GenericModule title="Financial Report" description="Revenue, costs, and profitability" {...props} />,
  CustomReport: (props) => <GenericModule title="Custom Report" description="Build custom reports with filters" {...props} />,
  Dashboard: (props) => <GenericModule title="Dashboard" description="Business overview and KPIs" {...props} />,
  Settings: (props) => <GenericModule title="Preferences" description="System configuration and settings" {...props} />,
  Shortcuts: (props) => <ShortcutsModule {...props} />,
  About: (props) => <AboutModule {...props} />
};

// Shortcuts reference component
function ShortcutsModule() {
  const shortcuts = [
    { category: 'Sales Screen', items: [
      { keys: 'F2', action: 'Focus product search' },
      { keys: 'Enter', action: 'Add selected product to invoice' },
      { keys: 'Delete', action: 'Remove selected line item' },
      { keys: 'F10 / Ctrl+S', action: 'Complete sale / Save invoice' },
      { keys: 'Escape', action: 'Clear selection / Cancel' }
    ]},
    { category: 'Global', items: [
      { keys: 'F9', action: 'New Invoice' },
      { keys: 'Ctrl+N', action: 'New Document' },
      { keys: 'Ctrl+W', action: 'Close current tab' },
      { keys: 'Ctrl+Tab', action: 'Switch to next tab' }
    ]}
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Keyboard Shortcuts</h1>
      {shortcuts.map((section) => (
        <div key={section.category} className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {section.category}
          </h2>
          <div className="erp-panel">
            {section.items.map((shortcut, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0"
              >
                <span className="text-sm">{shortcut.action}</span>
                <kbd className="kbd">{shortcut.keys}</kbd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// About component
function AboutModule() {
  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-primary-foreground">ERP</span>
      </div>
      <h1 className="text-xl font-semibold mb-2">Enterprise Resource Planning</h1>
      <p className="text-muted-foreground text-sm mb-4">Version 1.0.0</p>
      <div className="erp-panel p-4 text-sm text-left">
        <p className="mb-2">A comprehensive business management solution featuring:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Point of Sale (POS)</li>
          <li>Inventory Management</li>
          <li>Customer Relationship Management</li>
          <li>Financial Reporting</li>
          <li>Multi-Document Interface</li>
        </ul>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        © 2024 ERP System. All rights reserved.
      </p>
    </div>
  );
}

function MainWorkspace() {
  const { tabs, activeTabId } = useTabs();

  // Get the active tab
  const activeTab = tabs.find(t => t.id === activeTabId);

  // Show welcome screen if no tabs
  if (!activeTab) {
    return (
      <div className="workspace flex items-center justify-center">
        Hello ,,,
      </div>
    );
  }

  // Get the component for this tab type
  const Component = componentRegistry[activeTab.type];

  if (!Component) {
    return (
      <div className="workspace flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Unknown module: {activeTab.type}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <Component 
        tabId={activeTab.id} 
        isActive={true}
        {...activeTab.props} 
      />
    </div>
  );
}

export default MainWorkspace;
