import { useState, useCallback } from 'react';
import RequestHandler from '@util/requestHandler.js';

// =====================================================
// API CONFIGURATION
// =====================================================
// Default endpoint: http://localhost:4321/api/products/search
// Expected query params: ?q=searchTerm&category=all&stock=available
// Expected response: Array of product objects
// =====================================================
const API_ENDPOINT = "http://localhost:4321/api/products/search";

/**
 * Custom hook for fetching products from backend API
 * With fallback to sample data
 */
export default function useProductSearch() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestHandler = new RequestHandler();

  // Sample products data (fallback)
  const sampleProducts = [
    { id: 1, name: 'Laptop Pro 15"', ar_name: 'لابتوب برو 15 بوصة', usage: 'For professional work & gaming', ar_usage: 'للعمل المهني والألعاب', sellingPrice: 1299.99, unitName: 'Piece', sku: 'LAP-001', category: 'Electronics', stock: 25, barcode: '1234567890123' },
    { id: 2, name: 'Wireless Mouse', ar_name: 'فأرة لاسلكية', usage: 'Ergonomic office use', ar_usage: 'استخدام مكتبي مريح', sellingPrice: 39.99, unitName: 'Piece', sku: 'MOU-002', category: 'Accessories', stock: 150, barcode: '1234567890124' },
    { id: 3, name: 'Mechanical Keyboard RGB', ar_name: 'لوحة مفاتيح ميكانيكية', usage: 'Gaming & typing comfort', ar_usage: 'الألعاب وكتابة مريحة', sellingPrice: 89.99, unitName: 'Piece', sku: 'KEY-003', category: 'Accessories', stock: 75, barcode: '1234567890125' },
    { id: 4, name: 'USB-C Hub 7-in-1', ar_name: 'محور يو اس بي-سي 7 في 1', usage: 'Connect all your devices', ar_usage: 'توصيل جميع أجهزتك', sellingPrice: 49.99, unitName: 'Piece', sku: 'HUB-004', category: 'Accessories', stock: 200, barcode: '1234567890126' },
    { id: 5, name: 'Monitor 27" 4K', ar_name: 'شاشة 27 بوصة 4K', usage: 'Crystal clear display', ar_usage: 'شاشة فائقة الوضوح', sellingPrice: 449.99, unitName: 'Piece', sku: 'MON-005', category: 'Electronics', stock: 30, barcode: '1234567890127' },
    { id: 6, name: 'Webcam HD 1080p', ar_name: 'كاميرا ويب اتش دي 1080', usage: 'Clear video calls', ar_usage: 'مكالمات فيديو واضحة', sellingPrice: 69.99, unitName: 'Piece', sku: 'CAM-006', category: 'Accessories', stock: 0, barcode: '1234567890128' },
    { id: 7, name: 'SSD 1TB NVMe', ar_name: 'اس اس دي 1 تيرابايت', usage: 'Fast storage upgrade', ar_usage: 'ترقية تخزين سريعة', sellingPrice: 99.99, unitName: 'Piece', sku: 'SSD-007', category: 'Storage', stock: 45, barcode: '1234567890129' },
    { id: 8, name: 'Power Bank 20000mAh', ar_name: 'باور بانك 20000 مللي', usage: 'Charge on the go', ar_usage: 'شحن أثناء التنقل', sellingPrice: 34.99, unitName: 'Piece', sku: 'PWB-008', category: 'Accessories', stock: 80, barcode: '1234567890130' }
  ];

  const fetchProducts = useCallback(async (term = '', category = 'all', stock = 'available') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (term) params.append('q', term);
      if (category !== 'all') params.append('category', category);
      params.append('stock', stock);
      
      // Make API call
      const response = await requestHandler.get(`${API_ENDPOINT}?${params.toString()}`);
      
      if (response && response.state !== false && Array.isArray(response.data)) {
        // Backend returned products
        setProducts(response.data);
        // Extract unique categories from fetched products
        const uniqueCategories = [...new Set(response.map(p => p.category))];
        setCategories(['all', ...uniqueCategories]);
      } else {
        // Fallback to sample data
        console.log('useProductSearch: Using sample data - backend not available');
        setProducts(sampleProducts);
        const uniqueCategories = [...new Set(sampleProducts.map(p => p.category))];
        setCategories(['all', ...uniqueCategories]);
      }
    } catch (err) {
      console.error('useProductSearch: Error fetching products:', err);
      setError(err.message);
      // Fallback to sample data on error
      setProducts(sampleProducts);
      const uniqueCategories = [...new Set(sampleProducts.map(p => p.category))];
      setCategories(['all', ...uniqueCategories]);
    } finally {
      setIsLoading(false);
    }
  }, [requestHandler]);

  // Get filtered products based on search criteria
  const getFilteredProducts = useCallback((searchTerm, searchBy, stockFilter) => {
    let filtered = [...products];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        switch (searchBy) {
          case 'name': return product.name?.toLowerCase().includes(term) || product.ar_name?.includes(searchTerm);
          case 'sku': return product.sku?.toLowerCase().includes(term);
          case 'barcode': return product.barcode?.includes(searchTerm);
          default: return product.name?.toLowerCase().includes(term) || product.ar_name?.includes(searchTerm) || product.sku?.toLowerCase().includes(term);
        }
      });
    }
    
    if (stockFilter === 'available') filtered = filtered.filter(p => p.stock > 0);
    else if (stockFilter === 'unavailable') filtered = filtered.filter(p => p.stock === 0);
    
    return filtered;
  }, [products]);

  return {
    products,
    categories,
    isLoading,
    error,
    fetchProducts,
    getFilteredProducts,
    // For manual filtering if needed
    setProducts,
    setCategories
  };
}
