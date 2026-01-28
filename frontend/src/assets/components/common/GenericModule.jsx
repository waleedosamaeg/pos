import React from 'react';
import { Construction } from 'lucide-react';

/**
 * Generic Module Placeholder
 * Used for modules that haven't been fully implemented yet
 */

function GenericModule({ title, description }) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
          <Construction size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="erp-panel p-4">
          <p className="text-xs text-muted-foreground">
            This module is available in the full version of the ERP system.
            The architecture supports dynamic loading of additional modules.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GenericModule;
