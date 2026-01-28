import React from 'react';
import { TrendingUp, BarChart3, Calendar, Download } from 'lucide-react';

/**
 * Sales Report Module
 * Detailed sales analytics and trends
 */
export default function SalesReport() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="space-y-6">
        <div className="erp-panel">
          <div className="erp-panel-header flex items-center gap-2">
            <TrendingUp size={16} />
            <span>Sales Report</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="erp-panel p-4">
                <p className="text-muted-foreground text-xs mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-primary">SAR 45,250.00</p>
              </div>
              <div className="erp-panel p-4">
                <p className="text-muted-foreground text-xs mb-1">Transactions</p>
                <p className="text-2xl font-bold text-success">128</p>
              </div>
              <div className="erp-panel p-4">
                <p className="text-muted-foreground text-xs mb-1">Avg. Sale</p>
                <p className="text-2xl font-bold text-warning">SAR 353.50</p>
              </div>
              <div className="erp-panel p-4">
                <p className="text-muted-foreground text-xs mb-1">Revenue</p>
                <p className="text-2xl font-bold text-info">SAR 42,187.50</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">From Date</label>
                  <input type="date" className="erp-input" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">To Date</label>
                  <input type="date" className="erp-input" />
                </div>
                <div className="flex items-end gap-2">
                  <button className="erp-btn erp-btn-primary flex items-center gap-2">
                    <BarChart3 size={14} /> Generate
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-grid-header rounded border border-border text-center text-muted-foreground">
              <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
              <p>Chart visualization will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
