import React, { useState, useRef, useEffect } from 'react';
import { useTabs } from '@context/TabContext.jsx';
import { 
  FileText, 
  Edit3, 
  Eye, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  HelpCircle,
  FilePlus,
  FileOutput,
  Save,
  Printer,
  LogOut,
  Undo,
  Redo,
  Copy,
  Scissors,
  ClipboardPaste,
  Settings,
  Layout,
  Maximize,
  Users,
  UserPlus,
  Building,
  Truck,
  PackagePlus,
  PackageSearch,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Info,
  BookOpen,
  MessageCircle,
  Receipt,
  CreditCard,
  ChevronRight
} from 'lucide-react';

/**
 * Desktop-style Application Menu Bar with nested submenus
 */

// Menu structure with nested submenus
const menuStructure = [
  {
    label: 'File',
    items: [
      { label: 'New Invoice', icon: FilePlus, action: 'sales', shortcut: 'Ctrl+N' },
      { label: 'Open...', icon: FileText, action: null, shortcut: 'Ctrl+O' },
      { type: 'separator' },
      { label: 'Save', icon: Save, action: null, shortcut: 'Ctrl+S' },
      { label: 'Save As...', icon: FileOutput, action: null },
      { type: 'separator' },
      { label: 'Print', icon: Printer, action: null, shortcut: 'Ctrl+P' },
      { type: 'separator' },
      { label: 'Exit', icon: LogOut, action: 'exit' }
    ]
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', icon: Undo, action: null, shortcut: 'Ctrl+Z' },
      { label: 'Redo', icon: Redo, action: null, shortcut: 'Ctrl+Y' },
      { type: 'separator' },
      { label: 'Cut', icon: Scissors, action: null, shortcut: 'Ctrl+X' },
      { label: 'Copy', icon: Copy, action: null, shortcut: 'Ctrl+C' },
      { label: 'Paste', icon: ClipboardPaste, action: null, shortcut: 'Ctrl+V' },
      { type: 'separator' },
      { label: 'Preferences', icon: Settings, action: 'settings', singleton: true }
    ]
  },
  {
    label: 'View',
    items: [
      { label: 'Dashboard', icon: Layout, action: 'dashboard', singleton: true },
      { label: 'Full Screen', icon: Maximize, action: null, shortcut: 'F11' },
      { type: 'separator' },
      { label: 'Refresh', icon: null, action: null, shortcut: 'F5' }
    ]
  },
  {
    label: 'Sales',
    items: [
      { label: 'New Invoice', icon: FilePlus, action: 'sales', shortcut: 'F9' },
      { label: 'Sales History', icon: Receipt, action: 'sales-history', singleton: true },
      { type: 'separator' },
      { 
        label: 'Customers', 
        icon: Users, 
        submenu: [
          { label: 'View All Customers', icon: Users, action: 'customers', singleton: true },
          { label: 'Add New Customer', icon: UserPlus, action: 'new-customer' },
          { type: 'separator' },
          { label: 'Customer Groups', icon: Building, action: 'customer-groups', singleton: true }
        ]
      },
      { type: 'separator' },
      { label: 'Payments', icon: CreditCard, action: 'payments', singleton: true },
      { label: 'Returns', icon: Undo, action: 'returns', singleton: true }
    ]
  },
  {
    label: 'Inventory',
    items: [
      { 
        label: 'Products', 
        icon: Package,
        submenu: [
          { label: 'View All Products', icon: Package, action: 'products', singleton: true },
          { label: 'Add New Product', icon: PackagePlus, action: 'new-product' },
          { label: 'Stock Search', icon: PackageSearch, action: 'stock-search', singleton: true },
          { type: 'separator' },
          { label: 'Categories', icon: Package, action: 'categories', singleton: true }
        ]
      },
      { type: 'separator' },
      { label: 'Suppliers', icon: Truck, action: 'suppliers', singleton: true },
      { label: 'Purchase Orders', icon: FileText, action: 'purchase-orders', singleton: true },
      { type: 'separator' },
      { label: 'Low Stock Alert', icon: AlertTriangle, action: 'low-stock', singleton: true }
    ]
  },
  {
    label: 'Reports',
    items: [
      { 
        label: 'Sales Reports', 
        icon: TrendingUp,
        submenu: [
          { label: 'Daily Sales', icon: Calendar, action: 'report-daily', singleton: true },
          { label: 'Weekly Sales', icon: TrendingUp, action: 'report-weekly', singleton: true },
          { label: 'Monthly Sales', icon: TrendingUp, action: 'report-monthly', singleton: true },
          { type: 'separator' },
          { label: 'Sales by Product', icon: Package, action: 'report-sales-product', singleton: true },
          { label: 'Sales by Customer', icon: Users, action: 'report-sales-customer', singleton: true }
        ]
      },
      { label: 'Inventory Report', icon: Package, action: 'report-inventory', singleton: true },
      { label: 'Financial Report', icon: DollarSign, action: 'report-financial', singleton: true },
      { type: 'separator' },
      { label: 'Custom Report', icon: BarChart3, action: 'report-custom' }
    ]
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation', icon: BookOpen, action: null },
      { label: 'Keyboard Shortcuts', icon: null, action: 'shortcuts', singleton: true, shortcut: 'Ctrl+/' },
      { type: 'separator' },
      { label: 'Support', icon: MessageCircle, action: null },
      { label: 'About', icon: Info, action: 'about', singleton: true }
    ]
  }
];

// Submenu component for nested menus
function SubMenu({ items, onItemClick, parentRef }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const submenuRef = useRef(null);

  return (
    <div 
      ref={submenuRef}
      className="absolute left-full top-0 ml-0.5 min-w-52 py-1 rounded-md shadow-2xl z-[100] border"
      style={{
        background: 'hsl(var(--popover))',
        borderColor: 'hsl(var(--border))'
      }}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return (
            <div 
              key={index} 
              className="my-1 mx-2 border-t"
              style={{ borderColor: 'hsl(var(--border))' }}
            />
          );
        }

        const hasSubmenu = item.submenu && item.submenu.length > 0;

        return (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className={`flex items-center justify-between px-3 py-2 mx-1 rounded-sm cursor-pointer transition-colors text-xs ${
                !item.action && !hasSubmenu ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                color: 'hsl(var(--popover-foreground))',
                background: hoveredItem === index ? 'hsl(var(--accent))' : 'transparent'
              }}
              onClick={() => {
                if (item.action || hasSubmenu) {
                  onItemClick(item);
                }
              }}
            >
              <span className="flex items-center gap-2">
                {item.icon && <item.icon size={14} className="opacity-70" />}
                <span>{item.label}</span>
              </span>
              <div className="flex items-center gap-2">
                {item.shortcut && (
                  <span className="text-[10px] opacity-50 font-mono">{item.shortcut}</span>
                )}
                {hasSubmenu && <ChevronRight size={12} className="opacity-50" />}
              </div>
            </div>

            {hasSubmenu && hoveredItem === index && (
              <SubMenu items={item.submenu} onItemClick={onItemClick} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Main dropdown menu component
function DropdownMenu({ items, onItemClick, onClose }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const menuRef = useRef(null);

  return (
    <div 
      ref={menuRef}
      className="absolute left-0 top-full mt-0.5 min-w-52 py-1 rounded-md shadow-2xl z-[100] border"
      style={{
        background: 'hsl(var(--popover))',
        borderColor: 'hsl(var(--border))'
      }}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return (
            <div 
              key={index} 
              className="my-1 mx-2 border-t"
              style={{ borderColor: 'hsl(var(--border))' }}
            />
          );
        }

        const hasSubmenu = item.submenu && item.submenu.length > 0;

        return (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className={`flex items-center justify-between px-3 py-2 mx-1 rounded-sm cursor-pointer transition-colors text-xs ${
                !item.action && !hasSubmenu ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                color: 'hsl(var(--popover-foreground))',
                background: hoveredItem === index ? 'hsl(var(--accent))' : 'transparent'
              }}
              onClick={() => {
                if (item.action) {
                  onItemClick(item);
                }
              }}
            >
              <span className="flex items-center gap-2">
                {item.icon && <item.icon size={14} className="opacity-70" />}
                <span>{item.label}</span>
              </span>
              <div className="flex items-center gap-2">
                {item.shortcut && (
                  <span className="text-[10px] opacity-50 font-mono">{item.shortcut}</span>
                )}
                {hasSubmenu && <ChevronRight size={12} className="opacity-50" />}
              </div>
            </div>

            {hasSubmenu && hoveredItem === index && (
              <SubMenu items={item.submenu} onItemClick={onItemClick} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AppMenuBar() {
  const { openTab } = useTabs();
  const [activeMenu, setActiveMenu] = useState(null);
  const menuBarRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuBarRef.current && !menuBarRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle menu item click
  const handleItemClick = (item) => {
    if (!item.action) {
      return;
    }

    // Map actions to tab types and titles
    const actionMap = {
      'sales': { type: 'SalesScreen', title: 'Sales Invoice' },
      'sales-history': { type: 'SalesHistory', title: 'Sales History' },
      'customers': { type: 'Customers', title: 'Customers' },
      'new-customer': { type: 'CustomerForm', title: 'New Customer' },
      'customer-groups': { type: 'CustomerGroups', title: 'Customer Groups' },
      'payments': { type: 'Payments', title: 'Payments' },
      'returns': { type: 'Returns', title: 'Returns' },
      'products': { type: 'Products', title: 'Products' },
      'new-product': { type: 'ProductForm', title: 'New Product' },
      'stock-search': { type: 'StockSearch', title: 'Stock Search' },
      'categories': { type: 'Categories', title: 'Categories' },
      'suppliers': { type: 'Suppliers', title: 'Suppliers' },
      'purchase-orders': { type: 'PurchaseOrders', title: 'Purchase Orders' },
      'low-stock': { type: 'LowStock', title: 'Low Stock Alert' },
      'report-sales': { type: 'SalesReport', title: 'Sales Report' },
      'report-daily': { type: 'DailySummary', title: 'Daily Sales' },
      'report-weekly': { type: 'WeeklySummary', title: 'Weekly Sales' },
      'report-monthly': { type: 'MonthlySummary', title: 'Monthly Sales' },
      'report-sales-product': { type: 'SalesByProduct', title: 'Sales by Product' },
      'report-sales-customer': { type: 'SalesByCustomer', title: 'Sales by Customer' },
      'report-inventory': { type: 'InventoryReport', title: 'Inventory Report' },
      'report-financial': { type: 'FinancialReport', title: 'Financial Report' },
      'report-custom': { type: 'CustomReport', title: 'Custom Report' },
      'dashboard': { type: 'Dashboard', title: 'Dashboard' },
      'settings': { type: 'Settings', title: 'Preferences' },
      'shortcuts': { type: 'Shortcuts', title: 'Keyboard Shortcuts' },
      'about': { type: 'About', title: 'About' }
    };

    const mapping = actionMap[item.action];
    if (mapping) {
      openTab(mapping.type, mapping.title, {}, item.singleton || false);
    }

    setActiveMenu(null);
  };

  // Toggle menu on click
  const handleMenuClick = (menuLabel) => {
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  // Hover to switch menus when one is already open
  const handleMenuHover = (menuLabel) => {
    if (activeMenu !== null) {
      setActiveMenu(menuLabel);
    }
  };

  return (
    <div 
      ref={menuBarRef}
      className="h-8 flex items-center px-1 gap-0.5 select-none border-b"
      style={{
        background: 'hsl(var(--menu-bar))',
        borderColor: 'hsl(var(--border))'
      }}
    >
      {/* Application logo/icon */}
      <div className="flex items-center px-2 mr-1">
        <div 
          className="w-5 h-5 rounded flex items-center justify-center"
          style={{ background: 'hsl(var(--primary))' }}
        >
          <span 
            className="text-[9px] font-bold"
            style={{ color: 'hsl(var(--primary-foreground))' }}
          >
            ERP
          </span>
        </div>
      </div>

      {/* Menu items */}
      {menuStructure.map((menu) => (
        <div key={menu.label} className="relative">
          <div
            className={`px-3 py-1 text-xs font-medium cursor-pointer rounded transition-colors`}
            style={{
              color: activeMenu === menu.label ? 'hsl(var(--foreground))' : 'hsl(var(--menu-bar-foreground))',
              background: activeMenu === menu.label ? 'hsl(var(--menu-hover))' : 'transparent'
            }}
            onClick={() => handleMenuClick(menu.label)}
            onMouseEnter={() => handleMenuHover(menu.label)}
          >
            {menu.label}
          </div>

          {/* Dropdown */}
          {activeMenu === menu.label && (
            <DropdownMenu 
              items={menu.items} 
              onItemClick={handleItemClick}
              onClose={() => setActiveMenu(null)}
            />
          )}
        </div>
      ))}

      {/* Right side - system info */}
      <div className="ml-auto flex items-center gap-4 px-3">
        <span 
          className="text-[10px]"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <span 
          className="text-[10px] px-1.5 py-0.5 rounded"
          style={{ 
            color: 'hsl(var(--muted-foreground))',
            background: 'hsl(var(--muted))'
          }}
        >
          v1.0.0
        </span>
      </div>
    </div>
  );
}

export default AppMenuBar;
