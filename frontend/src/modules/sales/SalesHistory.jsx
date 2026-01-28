import React from 'react';
import { Receipt, Eye, Download } from 'lucide-react';

/**
 * Sales History Module
 * View past sales transactions
 */
export default function SalesHistory() {
  const mockSales = [
    { id: 'INV-001', customer: 'John Doe', amount: 250.50, date: '2024-01-25', status: 'Completed' },
    { id: 'INV-002', customer: 'Jane Smith', amount: 1200.00, date: '2024-01-24', status: 'Completed' },
    { id: 'INV-003', customer: 'ABC Corp', amount: 5500.75, date: '2024-01-23', status: 'Completed' },
  ];

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="erp-panel">
        <div className="erp-panel-header flex items-center gap-2">
          <Receipt size={16} />
          <span>Sales History</span>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <input type="text" placeholder="Search by invoice number or customer..." className="erp-input" />
          </div>

          <div className="border border-border rounded-md overflow-hidden">
            <table className="data-grid w-full">
              <thead className="data-grid-header">
                <tr>
                  <th className="px-4 py-3">Invoice #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSales.map((sale) => (
                  <tr key={sale.id} className="data-grid-row hover:bg-grid-row-hover">
                    <td className="px-4 py-3 font-mono text-primary">{sale.id}</td>
                    <td className="px-4 py-3">{sale.customer}</td>
                    <td className="px-4 py-3 text-right amount-currency">SAR {sale.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{sale.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-semibold">
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button className="p-1 hover:bg-accent rounded transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      <button className="p-1 hover:bg-accent rounded transition-colors" title="Download">
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
