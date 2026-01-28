import React from 'react';
import { ShoppingCart, Plus, Trash2, Save } from 'lucide-react';

/**
 * Sales Invoice Module
 * Main sales/POS screen for creating invoices
 */
export default function SalesInvoice() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="erp-panel">
        <div className="erp-panel-header flex items-center gap-2">
          <ShoppingCart size={16} />
          <span>New Invoice</span>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">Invoice Number</label>
              <input type="text" placeholder="INV-001" className="erp-input" disabled />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">Date</label>
              <input type="date" className="erp-input" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">Customer</label>
            <input type="text" placeholder="Search or select customer..." className="erp-input" />
          </div>

          <div className="border border-border rounded-md overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-grid-header">
                <tr>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-right w-24">Qty</th>
                  <th className="px-3 py-2 text-right w-24">Price</th>
                  <th className="px-3 py-2 text-right w-24">Total</th>
                  <th className="px-3 py-2 w-12"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border hover:bg-grid-row-hover">
                  <td colSpan="5" className="px-3 py-4 text-center text-muted-foreground">
                    No items added yet. Search and add products above.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-4">
            <div className="text-right space-y-2">
              <div className="flex justify-between gap-8 text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>0.00</span>
              </div>
              <div className="flex justify-between gap-8 text-sm">
                <span className="text-muted-foreground">Tax:</span>
                <span>0.00</span>
              </div>
              <div className="flex justify-between gap-8 font-semibold text-foreground">
                <span>Total:</span>
                <span>0.00</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button className="erp-btn erp-btn-secondary flex items-center gap-2">
              <Plus size={14} /> Add Item
            </button>
            <button className="erp-btn erp-btn-primary flex items-center gap-2">
              <Save size={14} /> Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
