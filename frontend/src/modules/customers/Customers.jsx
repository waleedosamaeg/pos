import React from 'react';
import { Users, Plus, Edit2, Trash2, Search } from 'lucide-react';

/**
 * Customers Module
 * View and manage all customers
 */
export default function Customers() {
  const mockCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+966501234567', type: 'Regular' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+966509876543', type: 'VIP' },
    { id: 3, name: 'ABC Corporation', email: 'contact@abc.com', phone: '+966114567890', type: 'Business' },
  ];

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="erp-panel">
        <div className="erp-panel-header flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>Customers</span>
          </div>
          <button className="erp-btn erp-btn-primary flex items-center gap-2 px-3 py-1">
            <Plus size={14} /> Add Customer
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
              <input type="text" placeholder="Search customers..." className="erp-input pl-9" />
            </div>
          </div>

          <div className="border border-border rounded-md overflow-hidden">
            <table className="data-grid w-full">
              <thead className="data-grid-header">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCustomers.map((customer) => (
                  <tr key={customer.id} className="data-grid-row hover:bg-grid-row-hover">
                    <td className="px-4 py-3 font-semibold">{customer.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                    <td className="px-4 py-3">{customer.phone}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">
                        {customer.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button className="p-1 hover:bg-accent rounded transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1 hover:bg-destructive/20 text-destructive rounded transition-colors" title="Delete">
                        <Trash2 size={14} />
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
