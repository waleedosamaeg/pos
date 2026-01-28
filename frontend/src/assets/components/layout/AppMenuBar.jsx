import React, { useState, useRef, useEffect } from 'react';
import { useTabs } from '@context/TabContext.jsx';
import { useUiContext } from '@context/uiContext.jsx';
import { useUserContext } from '@context/userContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CompactLanguageSwitcher } from '@comp/languageSwitcher.jsx';
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
  ChevronRight,
  User,
  Sun,
  Moon
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
function SubMenu({ items, onItemClick, parentRef, isRTL = false }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const submenuRef = useRef(null);
  const [submenuStyle, setSubmenuStyle] = useState({
    position: 'absolute',
    top: 0,
    left: '100%',
    marginLeft: '2px',
    minWidth: '200px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '4px',
    boxShadow: '0 10px 38px rgba(0, 0, 0, 0.5)',
    zIndex: 101,
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--color-border-muted)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  });

  useEffect(() => {
    if (submenuRef.current) {
      const submenuRect = submenuRef.current.getBoundingClientRect();
      const parentRect = submenuRef.current.parentElement?.getBoundingClientRect();
      
      const newStyle = {
        position: 'absolute',
        top: 0,
        minWidth: '200px',
        paddingTop: '6px',
        paddingBottom: '6px',
        borderRadius: '4px',
        boxShadow: '0 10px 38px rgba(0, 0, 0, 0.5)',
        zIndex: 101,
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--color-border-muted)',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      };

      if (isRTL) {
        // In RTL, try to position on the left (right: 100%)
        // If it goes off-screen (left edge < 0), position on the right (left: 100%)
        const wouldFitOnLeft = parentRect && (parentRect.left - 200) > 0;
        
        if (wouldFitOnLeft) {
          newStyle.right = '100%';
          newStyle.marginRight = '2px';
        } else {
          newStyle.left = '100%';
          newStyle.marginLeft = '2px';
        }
      } else {
        // In LTR, try to position on the right (left: 100%)
        // If it goes off-screen (right edge > window width), position on the left (right: 100%)
        const wouldFitOnRight = parentRect && (parentRect.right + 200) < window.innerWidth;
        
        if (wouldFitOnRight) {
          newStyle.left = '100%';
          newStyle.marginLeft = '2px';
        } else {
          newStyle.right = '100%';
          newStyle.marginRight = '2px';
        }
      }

      setSubmenuStyle(newStyle);
    }
  }, [isRTL]);

  return (
    <div 
      ref={submenuRef}
      style={submenuStyle}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return (
            <div 
              key={index} 
              style={{
                margin: '4px 0',
                borderTop: '1px solid rgba(71, 85, 105, 0.2)',
              }}
            />
          );
        }

        const hasSubmenu = item.submenu && item.submenu.length > 0;

        return (
          <div
            key={index}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '12px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '13px',
                backgroundColor: hoveredItem === index ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: !item.action && !hasSubmenu ? 'not-allowed' : 'pointer',
                opacity: !item.action && !hasSubmenu ? 0.5 : 1,
                transition: 'background-color var(--transition-fast)',
              }}
              onClick={() => {
                if (item.action || hasSubmenu) {
                  onItemClick(item);
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.icon && <item.icon size={14} style={{ opacity: 0.7 }} />}
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                {item.shortcut && (
                  <span style={{ fontSize: '11px', opacity: 0.5, fontFamily: 'monospace' }}>{item.shortcut}</span>
                )}
                {hasSubmenu && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
              </div>
            </div>

            {hasSubmenu && hoveredItem === index && (
              <SubMenu items={item.submenu} onItemClick={onItemClick} isRTL={isRTL} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Main dropdown menu component
function DropdownMenu({ items, onItemClick, onClose, isRTL = false }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '4px',
    minWidth: '200px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '4px',
    boxShadow: '0 10px 38px rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--color-border-muted)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  });

  useEffect(() => {
    if (menuRef.current) {
      const menuElement = menuRef.current;
      const parentElement = menuElement.parentElement;
      const parentRect = parentElement?.getBoundingClientRect();
      
      const newStyle = {
        position: 'absolute',
        top: '100%',
        marginTop: '4px',
        minWidth: '200px',
        paddingTop: '6px',
        paddingBottom: '6px',
        borderRadius: '4px',
        boxShadow: '0 10px 38px rgba(0, 0, 0, 0.5)',
        zIndex: 100,
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--color-border-muted)',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      };

      if (isRTL) {
        // In Arabic, align menu to the right of parent
        newStyle.right = 0;
        newStyle.left = 'auto';
      } else {
        // In English, align menu to the left of parent
        newStyle.left = 0;
        newStyle.right = 'auto';
      }

      setMenuStyle(newStyle);
    }
  }, [isRTL]);

  return (
    <div 
      ref={menuRef}
      style={menuStyle}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return (
            <div 
              key={index}
              style={{
                margin: '4px 0',
                borderTop: '1px solid rgba(71, 85, 105, 0.2)',
              }}
            />
          );
        }

        const hasSubmenu = item.submenu && item.submenu.length > 0;

        return (
          <div
            key={index}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '12px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '13px',
                backgroundColor: hoveredItem === index ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: !item.action && !hasSubmenu ? 'not-allowed' : 'pointer',
                opacity: !item.action && !hasSubmenu ? 0.5 : 1,
                transition: 'background-color var(--transition-fast)',
              }}
              onClick={() => {
                if (item.action) {
                  onItemClick(item);
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.icon && <item.icon size={14} style={{ opacity: 0.7 }} />}
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                {item.shortcut && (
                  <span style={{ fontSize: '11px', opacity: 0.5, fontFamily: 'monospace' }}>{item.shortcut}</span>
                )}
                {hasSubmenu && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
              </div>
            </div>

            {hasSubmenu && hoveredItem === index && (
              <SubMenu items={item.submenu} onItemClick={onItemClick} isRTL={isRTL} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AppMenuBar() {
  const { openTab } = useTabs();
  const { state: uiState, dispatch: uiDispatch } = useUiContext();
  const { state: userState, dispatch: userDispatch } = useUserContext();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState(null);
  const menuBarRef = useRef(null);

  // Translate menu structure
  const getTranslatedMenuStructure = () => [
    {
      label: t('menu.file'),
      translationKey: 'menu.file',
      items: [
        { label: t('menuItems.newInvoice'), action: 'sales', shortcut: 'Ctrl+N', icon: FilePlus },
        { label: t('menuItems.open'), icon: FileText, action: null, shortcut: 'Ctrl+O' },
        { type: 'separator' },
        { label: t('menuItems.save'), icon: Save, action: null, shortcut: 'Ctrl+S' },
        { label: t('menuItems.saveAs'), icon: FileOutput, action: null },
        { type: 'separator' },
        { label: t('menuItems.print'), icon: Printer, action: null, shortcut: 'Ctrl+P' },
        { type: 'separator' },
        { label: t('menuItems.exit'), icon: LogOut, action: 'exit' }
      ]
    },
    {
      label: t('menu.edit'),
      translationKey: 'menu.edit',
      items: [
        { label: t('menuItems.undo'), icon: Undo, action: null, shortcut: 'Ctrl+Z' },
        { label: t('menuItems.redo'), icon: Redo, action: null, shortcut: 'Ctrl+Y' },
        { type: 'separator' },
        { label: t('menuItems.cut'), icon: Scissors, action: null, shortcut: 'Ctrl+X' },
        { label: t('menuItems.copy'), icon: Copy, action: null, shortcut: 'Ctrl+C' },
        { label: t('menuItems.paste'), icon: ClipboardPaste, action: null, shortcut: 'Ctrl+V' },
        { type: 'separator' },
        { label: t('menuItems.preferences'), icon: Settings, action: 'settings', singleton: true }
      ]
    },
    {
      label: t('menu.view'),
      translationKey: 'menu.view',
      items: [
        { label: t('menuItems.dashboard'), icon: Layout, action: 'dashboard', singleton: true },
        { label: t('menuItems.fullScreen'), icon: Maximize, action: null, shortcut: 'F11' },
        { type: 'separator' },
        { label: t('menuItems.refresh'), icon: null, action: null, shortcut: 'F5' }
      ]
    },
    {
      label: t('menu.sales'),
      translationKey: 'menu.sales',
      items: [
        { label: t('menuItems.newInvoice'), icon: FilePlus, action: 'sales', shortcut: 'F9' },
        { label: t('menuItems.salesHistory'), icon: Receipt, action: 'sales-history', singleton: true },
        { type: 'separator' },
        { 
          label: t('menuItems.customers'),
          icon: Users, 
          submenu: [
            { label: t('menuItems.viewAllCustomers'), icon: Users, action: 'customers', singleton: true },
            { label: t('menuItems.newCustomer'), icon: UserPlus, action: 'new-customer' },
            { type: 'separator' },
            { label: t('menuItems.customerGroups'), icon: Building, action: 'customer-groups', singleton: true }
          ]
        },
        { type: 'separator' },
        { label: t('menuItems.payments'), icon: CreditCard, action: 'payments', singleton: true },
        { label: t('menuItems.returns'), icon: Undo, action: 'returns', singleton: true }
      ]
    },
    {
      label: t('menu.inventory'),
      translationKey: 'menu.inventory',
      items: [
        { 
          label: t('menuItems.products'),
          icon: Package,
          submenu: [
            { label: t('menuItems.viewAllProducts'), icon: Package, action: 'products', singleton: true },
            { label: t('menuItems.newProduct'), icon: PackagePlus, action: 'new-product' },
            { label: t('menuItems.stockSearch'), icon: PackageSearch, action: 'stock-search', singleton: true },
            { type: 'separator' },
            { label: t('menuItems.categories'), icon: Package, action: 'categories', singleton: true }
          ]
        },
        { type: 'separator' },
        { label: t('menuItems.suppliers'), icon: Truck, action: 'suppliers', singleton: true },
        { label: t('menuItems.purchaseOrders'), icon: FileText, action: 'purchase-orders', singleton: true },
        { type: 'separator' },
        { label: t('menuItems.lowStockAlert'), icon: AlertTriangle, action: 'low-stock', singleton: true }
      ]
    },
    {
      label: t('menu.reports'),
      translationKey: 'menu.reports',
      items: [
        { 
          label: t('menuItems.salesReports'),
          icon: TrendingUp,
          submenu: [
            { label: t('menuItems.dailySales'), icon: Calendar, action: 'report-daily', singleton: true },
            { label: t('menuItems.weeklySales'), icon: TrendingUp, action: 'report-weekly', singleton: true },
            { label: t('menuItems.monthlySales'), icon: TrendingUp, action: 'report-monthly', singleton: true },
            { type: 'separator' },
            { label: t('menuItems.salesByProduct'), icon: Package, action: 'report-sales-product', singleton: true },
            { label: t('menuItems.salesByCustomer'), icon: Users, action: 'report-sales-customer', singleton: true }
          ]
        },
        { label: t('menuItems.inventoryReport'), icon: Package, action: 'report-inventory', singleton: true },
        { label: t('menuItems.financialReport'), icon: DollarSign, action: 'report-financial', singleton: true },
        { type: 'separator' },
        { label: t('menuItems.customReport'), icon: BarChart3, action: 'report-custom' }
      ]
    },
    {
      label: t('menu.help'),
      translationKey: 'menu.help',
      items: [
        { label: t('menuItems.documentation'), icon: BookOpen, action: null },
        { label: t('menuItems.keyboardShortcuts'), icon: null, action: 'shortcuts', singleton: true, shortcut: 'Ctrl+/' },
        { type: 'separator' },
        { label: t('menuItems.aboutApp'), icon: Info, action: 'about' }
      ]
    }
  ];

  // Logout handler
  const handleLogout = () => {
    uiDispatch({
      type: 'confirm',
      payload: {
        title: t('confirm.logout.title'),
        message: t('confirm.logout.message'),
        onConfirm: () => {
          // Clear localStorage
          localStorage.clear();
          // Clear user context
          userDispatch({ type: 'user.logout' });
          // Redirect to login
          navigate('/login');
        }
      }
    });
  };

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

  // Check if RTL
  const isRTL = uiState.lang === 'ar';

  // Get user info
  console.log(userState)
  const userName = userState?.user?.profile?.nickname || 'Guest';
  let userRole = userState?.user?.profile?.role || 'User';
  if (userRole === 3 ) {
    userRole = "Administrator"
  }else if (userRole === 2 ) {  
    userRole = "Manager"
  }else {
    userRole = "Staff"
  }

  // Handle menu item click
  const handleItemClick = (item) => {
    if (!item.action) {
      return;
    }

    // Handle logout action
    if (item.action === 'exit') {
      handleLogout();
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

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = uiState.theme === 'dark' ? 'light' : 'dark';
    uiDispatch({ type: 'set-theme', payload: newTheme });
  };

  return (
    <div 
      ref={menuBarRef}
      style={{
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '0',
        paddingRight: '12px',
        gap: '0',
        userSelect: 'none',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--color-border-muted)',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* Application logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        paddingLeft: '8px',
        paddingRight: '16px',
        borderRight: '1px solid var(--color-border-muted)',
      }}>
        <div 
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-primary)',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#1e293b',
            letterSpacing: '0.5px',
          }}
        >
          Ω
        </div>
      </div>

      {/* Menu items */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', flex: 1 }}>
        {getTranslatedMenuStructure().map((menu) => (
          <div key={menu.translationKey} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                height: '100%',
                paddingLeft: '12px',
                paddingRight: '12px',
                fontSize: '12px',
                fontWeight: '400',
                cursor: 'pointer',
                color: activeMenu === menu.label ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                backgroundColor: activeMenu === menu.label 
                  ? 'rgba(250, 204, 21, 0.08)'
                  : 'transparent',
                borderBottom: activeMenu === menu.label
                  ? '2px solid var(--color-primary)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'all var(--transition-fast)',
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
                isRTL={isRTL}
              />
            )}
          </div>
        ))}
      </div>

      {/* Right side - system info and language switcher */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        height: '100%',
      }}>
        {/* Language Switcher */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          height: '100%',
          paddingLeft: '12px',
          paddingRight: '12px',
          borderLeft: '1px solid var(--color-border-muted)',
        }}>
          <CompactLanguageSwitcher />
        </div>

        {/* Separator */}
        <div style={{
          width: '1px',
          height: '20px',
          backgroundColor: 'var(--color-border-muted)',
        }} />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${uiState.theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            borderRadius: '4px',
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
          {uiState.theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Separator */}
        <div style={{
          width: '1px',
          height: '20px',
          backgroundColor: 'var(--color-border-muted)',
        }} />

        {/* Current User Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          paddingLeft: '8px',
          paddingRight: '12px',
        }}>
          <User size={14} style={{ color: 'var(--color-primary)' }} />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '11px',
          }}>
            <span style={{ 
              color: 'var(--color-text)', 
              fontWeight: '600',
              lineHeight: '1.2'
            }}>
              {userName}
            </span>
            <span style={{ 
              color: 'var(--color-muted)',
              fontSize: '10px',
              lineHeight: '1.2'
            }}>
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppMenuBar;
