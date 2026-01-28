/**
 * AddProduct Component Usage Guide
 * 
 * FEATURES:
 * ✓ Modern modal form with gradient design
 * ✓ Validates all required fields (English name, Arabic name)
 * ✓ Character count limits (45 chars for names, 20 chars for shortcut)
 * ✓ Real-time error handling
 * ✓ Loading state during submission
 * ✓ Bilingual support (English & Arabic)
 * ✓ Category dropdown with preset options
 * ✓ Active/Inactive toggle status
 * 
 * FORM FIELDS:
 * 1. Product Name (required, max 45 chars)
 * 2. Arabic Name (required, max 45 chars, RTL support)
 * 3. Description (optional, textarea)
 * 4. Shortcut Code (optional, max 20 chars, unique)
 * 5. Category (dropdown, default: General)
 * 6. Active Status (checkbox toggle)
 * 
 * DATABASE MAPPING:
 * Form field -> Database Column
 * name -> products.name
 * ar_name -> products.ar_name
 * description -> products.description
 * shortcut -> products.shortcut
 * category_id -> products.category_id
 * is_active -> products.is_active
 * 
 * INTEGRATION WITH PRODUCTS.JSX:
 * 1. Component is imported in Products.jsx
 * 2. Modal state controlled by isAddProductOpen
 * 3. handleAddProduct() processes form submission
 * 4. Add backend API call in handleAddProduct when ready
 * 
 * STYLING:
 * - Uses Tailwind CSS with dark theme
 * - Gradient backgrounds (slate colors)
 * - Yellow accent (#facc15 - matches app theme)
 * - Smooth transitions and hover effects
 * - Focus rings with accent color
 * - Responsive design (max-width: 2xl)
 * 
 * TO DO ITEMS:
 * 1. [ ] Connect to backend API endpoint (POST /api/products)
 * 2. [ ] Add error toast notifications
 * 3. [ ] Add success confirmation message
 * 4. [ ] Fetch categories dynamically from database
 * 5. [ ] Add image upload field if needed
 * 6. [ ] Add batch/unit management if needed
 */
