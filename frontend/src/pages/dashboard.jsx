import React from 'react';
import { TabProvider } from '@context/TabContext.jsx';
import AppMenuBar from '@comp/layout/AppMenuBar.jsx';
import TabBar from '@comp/layout/TabBar.jsx';
import MainWorkspace from '@comp/layout/MainWorkspace.jsx';
import { useKeyPress } from '@hook/useKeyPress.jsx';
import { useTabs } from '@context/TabContext.jsx';

/**
 * Main Application Component
 * Creates the desktop-like MDI shell structure
 */

// Global keyboard shortcuts handler component
function GlobalShortcuts() {
  const { openTab, closeTab, activeTabId, tabs, switchTab } = useTabs();

  useKeyPress({
    // F9 - New Invoice
    'F9': () => {
      openTab('SalesScreen', 'Sales Invoice');
    },
    // Ctrl+N - New Document (same as New Invoice for now)
    'Ctrl+n': () => {
      openTab('SalesScreen', 'Sales Invoice');
    },
    // Ctrl+W - Close current tab
    'Ctrl+w': () => {
      if (activeTabId) {
        closeTab(activeTabId);
      }
    },
    // Ctrl+Tab - Switch to next tab
    'Ctrl+Tab': () => {
      if (tabs.length > 1 && activeTabId) {
        const currentIndex = tabs.findIndex(t => t.id === activeTabId);
        const nextIndex = (currentIndex + 1) % tabs.length;
        switchTab(tabs[nextIndex].id);
      }
    },
    // Ctrl+/ - Show shortcuts
    'Ctrl+/': () => {
      openTab('Shortcuts', 'Keyboard Shortcuts', {}, true);
    }
  }, true);

  return null;
}

// App Shell Layout
function AppShell() {
  return (
    <div className="h-screen flex flex-col overflow-hidden no-select">
      {/* Global keyboard handler */}
      <GlobalShortcuts />
      
      {/* Top Menu Bar */}
      <AppMenuBar />
      
      {/* Tab Bar */}
      <TabBar />
      
      {/* Main Workspace */}
      <MainWorkspace />
    </div>
  );
}

// Root App Component with Provider
function App() {
  return (
    <TabProvider>
      <AppShell />
    </TabProvider>
  );
}

export default App;
