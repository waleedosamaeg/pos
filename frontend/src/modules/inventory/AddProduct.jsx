import React, { useState } from 'react';
import { X, Plus, Package, DollarSign, BarChart3, Tag } from 'lucide-react';

/**
 * AddProduct Component
 * Modal form for adding new products to inventory
 * Based on products table structure
 */
export default function AddProduct({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    ar_name: '',
    description: '',
    shortcut: '',
    category_id: 1,
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length > 45) {
      newErrors.name = 'Product name must be 45 characters or less';
    }

    if (!formData.ar_name.trim()) {
      newErrors.ar_name = 'Arabic name is required';
    } else if (formData.ar_name.length > 45) {
      newErrors.ar_name = 'Arabic name must be 45 characters or less';
    }

    if (formData.shortcut && formData.shortcut.length > 20) {
      newErrors.shortcut = 'Shortcut must be 20 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      // Reset form
      setFormData({
        name: '',
        ar_name: '',
        description: '',
        shortcut: '',
        category_id: 1,
        is_active: true,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '50rem',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--color-border-muted)',
        maxHeight: '90vh',
        overflowY: 'auto',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}>
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Package className="text-yellow-500" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add New Product</h2>
              <p className="text-xs text-slate-400 mt-0.5">Create a new product in your inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Main Product Info Section */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Tag size={16} className="text-yellow-500" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* English Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  maxLength="45"
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                <p className="text-xs text-slate-500 mt-1">{formData.name.length}/45</p>
              </div>

              {/* Arabic Name */}
              <div>
                <label htmlFor="ar_name" className="block text-sm font-medium text-slate-300 mb-2">
                  Arabic Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="ar_name"
                  name="ar_name"
                  value={formData.ar_name}
                  onChange={handleChange}
                  placeholder="أدخل الاسم بالعربية"
                  maxLength="45"
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-right ${
                    errors.ar_name ? 'border-red-500' : 'border-slate-600'
                  }`}
                  dir="rtl"
                />
                {errors.ar_name && <p className="text-red-400 text-xs mt-1">{errors.ar_name}</p>}
                <p className="text-xs text-slate-500 mt-1">{formData.ar_name.length}/45</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-yellow-500" />
              Details
            </h3>

            <div className="space-y-4">
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description (optional)"
                  rows="4"
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Shortcut Code */}
                <div>
                  <label htmlFor="shortcut" className="block text-sm font-medium text-slate-300 mb-2">
                    Shortcut Code
                  </label>
                  <input
                    type="text"
                    id="shortcut"
                    name="shortcut"
                    value={formData.shortcut}
                    onChange={handleChange}
                    placeholder="e.g., PROD-001"
                    maxLength="20"
                    className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-mono ${
                      errors.shortcut ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                  {errors.shortcut && <p className="text-red-400 text-xs mt-1">{errors.shortcut}</p>}
                  <p className="text-xs text-slate-500 mt-1">{formData.shortcut.length}/20</p>
                </div>

                {/* Category ID */}
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  >
                    <option value="1">General</option>
                    <option value="2">Electronics</option>
                    <option value="3">Clothing</option>
                    <option value="4">Food & Beverage</option>
                    <option value="5">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-300">
                Active Product
              </span>
              <span className="ml-auto text-xs text-slate-500">
                {formData.is_active ? '✓ Active' : '○ Inactive'}
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
