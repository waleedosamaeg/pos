import React from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';

/**
 * Help Module
 * Documentation and shortcuts
 */
export default function Help() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-3xl">
        <div className="erp-panel">
          <div className="erp-panel-header flex items-center gap-2">
            <HelpCircle size={16} />
            <span>Help & Documentation</span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <BookOpen size={16} /> Keyboard Shortcuts
              </h3>
              <div className="bg-grid-header rounded p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">New Invoice</span>
                  <kbd className="kbd">F9</kbd>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-xs">Save</span>
                  <kbd className="kbd">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-xs">Close Tab</span>
                  <kbd className="kbd">Ctrl+W</kbd>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-2 text-xs text-muted-foreground">
                <li>Create a new invoice from the File menu</li>
                <li>Select or add a customer</li>
                <li>Add products to the invoice</li>
                <li>Review and complete the sale</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
