import { useEffect, useCallback } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * Only triggers when the component/tab is active
 * 
 * @param {object} keyMap - Object mapping key combinations to handler functions
 * @param {boolean} isActive - Whether this hook should be active (for tab-specific shortcuts)
 * @param {array} dependencies - Additional dependencies for the effect
 * 
 * Key format examples:
 * - 'F2' - Function key
 * - 'Enter' - Enter key
 * - 'Delete' - Delete key
 * - 'Ctrl+S' - Ctrl + S combination
 * - 'Ctrl+Shift+N' - Multiple modifiers
 */
export function useKeyPress(keyMap, isActive = true, dependencies = []) {
  
  const handleKeyDown = useCallback((event) => {
    // Don't trigger if not active
    if (!isActive) return;
    
    // Don't trigger if user is typing in an input/textarea (unless explicitly handled)
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
    
    // Build the key combination string
    const modifiers = [];
    if (event.ctrlKey || event.metaKey) modifiers.push('Ctrl');
    if (event.shiftKey) modifiers.push('Shift');
    if (event.altKey) modifiers.push('Alt');
    
    const key = event.key;
    const combination = [...modifiers, key].join('+');
    
    // Check if this combination is in our keyMap
    const handler = keyMap[combination] || keyMap[key];
    
    if (handler) {
      // For function keys and special combinations, prevent default
      const shouldPreventDefault = 
        key.startsWith('F') || 
        modifiers.length > 0 ||
        key === 'Escape' ||
        (!isTyping && (key === 'Delete' || key === 'Enter'));
      
      if (shouldPreventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      // Execute the handler
      handler(event, { isTyping, combination });
    }
  }, [keyMap, isActive, ...dependencies]);

  useEffect(() => {
    // Add global listener
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Hook specifically for navigation keys (Arrow keys, Tab, Enter)
 * Useful for grid/list navigation
 */
export function useNavigationKeys(handlers, isActive = true) {
  const keyMap = {
    'ArrowUp': handlers.onUp,
    'ArrowDown': handlers.onDown,
    'ArrowLeft': handlers.onLeft,
    'ArrowRight': handlers.onRight,
    'Enter': handlers.onEnter,
    'Escape': handlers.onEscape,
    'Tab': handlers.onTab,
    'Shift+Tab': handlers.onShiftTab
  };

  // Filter out undefined handlers
  const filteredKeyMap = Object.fromEntries(
    Object.entries(keyMap).filter(([, handler]) => handler !== undefined)
  );

  useKeyPress(filteredKeyMap, isActive);
}

export default useKeyPress;
