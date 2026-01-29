import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Tab Context - Manages the MDI (Multi-Document Interface) tab system
 * Handles opening, closing, and switching between tabs
 */

const TabContext = createContext(null);

// Generate unique tab IDs
let tabIdCounter = 0;
const generateTabId = () => `tab-${++tabIdCounter}`;

export function TabProvider({ children }) {
  // Array of open tabs: { id, type, title, props }
  const [tabs, setTabs] = useState([]);

  // Currently active tab ID
  const [activeTabId, setActiveTabId] = useState(null);

  // Tab states storage: { tabId: { componentType: stateData } }
  const [tabStates, setTabStates] = useState({});

  /**
   * Opens a new tab or activates existing tab
   * @param {string} componentType - The component type to render
   * @param {string} title - Tab title
   * @param {object} props - Additional props to pass to the component
   * @param {boolean} singleton - If true, only one tab of this type can exist
   */
  const openTab = useCallback((componentType, title, props = {}, singleton = false) => {
    // If singleton, check if tab of this type already exists
    if (singleton) {
      const existingTab = tabs.find(tab => tab.type === componentType);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        return existingTab.id;
      }
    }

    const newTab = {
      id: generateTabId(),
      type: componentType,
      title,
      props
    };

    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
    
    return newTab.id;
  }, [tabs]);

  /**
   * Closes a tab by ID
   * @param {string} tabId - The tab ID to close
   */
  const closeTab = useCallback((tabId) => {
    setTabs(prevTabs => {
      const tabIndex = prevTabs.findIndex(t => t.id === tabId);
      const newTabs = prevTabs.filter(t => t.id !== tabId);
      
      // If closing the active tab, switch to adjacent tab
      if (activeTabId === tabId && newTabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      } else if (newTabs.length === 0) {
        setActiveTabId(null);
      }
      
      return newTabs;
    });
  }, [activeTabId]);

  /**
   * Switches to a specific tab
   * @param {string} tabId - The tab ID to activate
   */
  const switchTab = useCallback((tabId) => {
    const tabExists = tabs.some(t => t.id === tabId);
    if (tabExists) {
      setActiveTabId(tabId);
    }
  }, [tabs]);

  /**
   * Updates the title of a specific tab
   * @param {string} tabId - The tab ID to update
   * @param {string} newTitle - The new title
   */
  const updateTabTitle = useCallback((tabId, newTitle) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === tabId ? { ...tab, title: newTitle } : tab
      )
    );
  }, []);

  /**
   * Gets the currently active tab object
   */
  const getActiveTab = useCallback(() => {
    return tabs.find(t => t.id === activeTabId) || null;
  }, [tabs, activeTabId]);

  /**
   * Closes all tabs
   */
  const closeAllTabs = useCallback(() => {
    setTabs([]);
    setActiveTabId(null);
    setTabStates({});
  }, []);

  /**
   * Saves the state of a specific tab
   * @param {string} tabId - The tab ID
   * @param {string} componentType - The component type
   * @param {object} state - The state to save
   */
  const saveTabState = useCallback((tabId, componentType, state) => {
    setTabStates(prev => ({
      ...prev,
      [tabId]: {
        ...(prev[tabId] || {}),
        [componentType]: state
      }
    }));
  }, []);

  /**
   * Gets the saved state for a specific tab
   * @param {string} tabId - The tab ID
   * @param {string} componentType - The component type
   * @returns {object|null} The saved state or null
   */
  const getTabState = useCallback((tabId, componentType) => {
    return tabStates[tabId]?.[componentType] || null;
  }, [tabStates]);

  /**
   * Clears the state for a specific tab
   * @param {string} tabId - The tab ID
   */
  const clearTabState = useCallback((tabId) => {
    setTabStates(prev => {
      const newStates = { ...prev };
      delete newStates[tabId];
      return newStates;
    });
  }, []);

  const value = {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    switchTab,
    updateTabTitle,
    getActiveTab,
    closeAllTabs,
    saveTabState,
    getTabState,
    clearTabState
  };

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
}

/**
 * Hook to access tab context
 */
export function useTabs() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
}

export default TabContext;
