import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Search } from 'lucide-react';
import AddProduct from './AddProduct.jsx';

/**
 * Products Module
 * Product catalog management
 */
export default function Products() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', sku: 'TECH-001', category: 'Electronics', stock: 45, price: 1200.00 },
    { id: 2, name: 'Mouse', sku: 'TECH-002', category: 'Electronics', stock: 250, price: 25.00 },
    { id: 3, name: 'Keyboard', sku: 'TECH-003', category: 'Electronics', stock: 180, price: 75.00 },
  ]);

  const handleAddProduct = (formData) => {
    console.log('New product data:', formData);
    // TODO: Send to backend API
    // For now, just add to local state
    const newProduct = {
      id: products.length + 1,
      name: formData.name,
      ar_name: formData.ar_name,
      sku: formData.shortcut || `PROD-${formData.name.slice(0, 3).toUpperCase()}`,
      category: formData.category_id,
      stock: 0,
      price: 0.00,
      description: formData.description,
      is_active: formData.is_active,
    };
    setProducts([...products, newProduct]);
  };

  const mockProducts = products;

  return (
    <>
      <div className="p-6 h-full overflow-auto">
        <div className="erp-panel">
          <div className="erp-panel-header flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Package size={16} />
              <span>Products</span>
            </div>
            <button 
              onClick={() => setIsAddProductOpen(true)}
              className="erp-btn erp-btn-primary flex items-center gap-2 px-3 py-1"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
          <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-3 text-muted-foreground" />
              <input type="text" placeholder="Search products..." className="erp-input pl-9" />
            </div>
          </div>

          <div className="border border-border rounded-md overflow-hidden">
            <table className="data-grid w-full">
              <thead className="data-grid-header">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product) => (
                  <tr key={product.id} className="data-grid-row hover:bg-grid-row-hover">
                    <td className="px-4 py-3 font-semibold">{product.name}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{product.sku}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-semibold">
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right amount-currency">SAR {product.price.toFixed(2)}</td>
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

      {/* Add Product Modal */}
      <AddProduct 
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmit={handleAddProduct}
      />
    </>
  );
}
