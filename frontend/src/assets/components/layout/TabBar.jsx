import React from 'react';
import { useTabs } from '@context/TabContext.jsx';
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
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * Modern Tab Bar Component
 * Chrome-style tabs with smooth animations
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

function TabBar() {
  const { tabs, activeTabId, switchTab, closeTab, openTab } = useTabs();

  // Handle tab close with stop propagation
  const handleClose = (e, tabId) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  // Handle new tab
  const handleNewTab = () => {
    openTab('SalesScreen', 'Sales Invoice');
  };

  return (
    <div 
      className="h-10 flex items-stretch select-none border-b"
      style={{
        background: 'hsl(var(--tab-bar))',
        borderColor: 'hsl(var(--border))'
      }}
    >
      {/* Tab scroll area */}
      <div className="flex-1 flex items-stretch overflow-x-auto scrollbar-hide">
        {tabs.length === 0 ? (
          <div 
            className="flex items-center px-4 text-xs italic"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            No open documents — Press F9 or click + to create a new invoice
          </div>
        ) : (
          <div className="flex items-stretch">
            {tabs.map((tab, index) => {
              const IconComponent = tabIcons[tab.type] || FileText;
              const isActive = tab.id === activeTabId;

              return (
                <div
                  key={tab.id}
                  className={`group relative flex items-center gap-2 px-3 min-w-[120px] max-w-[200px] cursor-pointer transition-all duration-150 border-r`}
                  style={{
                    background: isActive 
                      ? 'hsl(var(--tab-active))' 
                      : 'transparent',
                    borderColor: 'hsl(var(--border) / 0.5)',
                    borderBottom: isActive 
                      ? '2px solid hsl(var(--primary))' 
                      : '2px solid transparent'
                  }}
                  onClick={() => switchTab(tab.id)}
                  title={tab.title}
                >
                  {/* Tab icon */}
                  <IconComponent 
                    size={14} 
                    className="flex-shrink-0 transition-colors"
                    style={{ 
                      color: isActive 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--muted-foreground))' 
                    }}
                  />
                  
                  {/* Tab title */}
                  <span 
                    className="flex-1 truncate text-xs font-medium transition-colors"
                    style={{ 
                      color: isActive 
                        ? 'hsl(var(--foreground))' 
                        : 'hsl(var(--muted-foreground))' 
                    }}
                  >
                    {tab.title}
                  </span>

                  {/* Close button */}
                  <button
                    className="flex-shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all"
                    onClick={(e) => handleClose(e, tab.id)}
                    title="Close tab (Ctrl+W)"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    <X size={12} />
                  </button>

                  {/* Active tab indicator glow */}
                  {isActive && (
                    <div 
                      className="absolute inset-x-0 bottom-0 h-0.5"
                      style={{ 
                        background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
                        opacity: 0.5
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New tab button */}
      <div className="flex items-center px-2 border-l" style={{ borderColor: 'hsl(var(--border) / 0.5)' }}>
        <button
          onClick={handleNewTab}
          className="p-1.5 rounded transition-colors hover:bg-accent"
          title="New Invoice (F9)"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Tab count indicator */}
      {tabs.length > 0 && (
        <div 
          className="flex items-center px-3 text-[10px] font-mono border-l"
          style={{ 
            color: 'hsl(var(--muted-foreground))',
            borderColor: 'hsl(var(--border) / 0.5)'
          }}
        >
          {tabs.length} tab{tabs.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default TabBar;
