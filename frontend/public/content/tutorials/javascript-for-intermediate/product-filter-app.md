# Project: Product Filter App with Real-Time Search

E-commerce catalogs and data dashboards rely on multi-faceted filtering—allowing users to filter products simultaneously by category, maximum price range, and real-time search query. In this project, we implement a multi-criteria **Product Filter Application**.

---

## 1. Project Specifications

1. **Multi-Faceted Filtering:** Filter simultaneously by:
   - Search term (text input matching product title or description).
   - Category dropdown (`All`, `Electronics`, `Footwear`, `Accessories`).
   - Price range slider with dynamic maximum value readout.
2. **Declarative Pipeline:** Filter array using `Array.prototype.filter()`.
3. **Empty State:** Display an empty state card when no products match.
4. **Performance:** Efficient DOM rendering with `DocumentFragment`.

---

## 2. HTML Markup (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GearShop: Dynamic Product Catalog</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <h2>Filters</h2>

      <div class="filter-group">
        <label for="search-input">Search Products</label>
        <input type="search" id="search-input" placeholder="e.g. Wireless, Pro..." />
      </div>

      <div class="filter-group">
        <label for="category-select">Category</label>
        <select id="category-select">
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="footwear">Footwear</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div class="filter-group">
        <div class="range-header">
          <label for="price-range">Max Price</label>
          <span id="price-display">$500</span>
        </div>
        <input type="range" id="price-range" min="20" max="500" step="10" value="500" />
      </div>
    </aside>

    <main class="main-content">
      <header class="catalog-header">
        <h1>Product Catalog</h1>
        <span id="result-count">Showing 0 products</span>
      </header>

      <div id="product-grid" class="product-grid"></div>
      <div id="empty-state" class="empty-state hidden">
        <p>No products match your active filter criteria.</p>
      </div>
    </main>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

---

## 3. Styling the Catalog (style.css)

```css
:root {
  --primary: #3b82f6;
  --bg: #0b0f19;
  --surface: #1e293b;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --border: #334155;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
}

.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: var(--surface);
  padding: 2rem;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-group label { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

input[type="search"], select {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: #0f172a;
  color: var(--text);
}

.range-header { display: flex; justify-content: space-between; font-size: 0.85rem; }

.main-content { padding: 2rem; }
.catalog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.badge {
  background: rgba(59, 130, 246, 0.15);
  color: var(--primary);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  align-self: flex-start;
}

.price { font-size: 1.25rem; font-weight: bold; color: #10b981; margin-top: 1rem; }
.empty-state { text-align: center; padding: 4rem 1rem; color: var(--text-muted); }
.hidden { display: none !important; }
```

---

## 4. Application Logic (app.js)

```javascript
// Product Database
const products = [
  { id: 1, name: 'Wireless Noise-Canceling Headphones', category: 'electronics', price: 299 },
  { id: 2, name: 'Mechanical Gaming Keyboard', category: 'electronics', price: 149 },
  { id: 3, name: 'Ultra-Lightweight Trail Running Shoes', category: 'footwear', price: 120 },
  { id: 4, name: 'Waterproof Leather Hiking Boots', category: 'footwear', price: 220 },
  { id: 5, name: 'Minimalist Minimal Cardholder Wallet', category: 'accessories', price: 35 },
  { id: 6, name: 'Aviator UV400 Sunglasses', category: 'accessories', price: 85 },
  { id: 7, name: 'Smart Fitness Tracker Watch', category: 'electronics', price: 180 },
  { id: 8, name: 'Breathable Running Socks (3-Pack)', category: 'accessories', price: 25 }
];

// Elements
const searchInput = document.querySelector('#search-input');
const categorySelect = document.querySelector('#category-select');
const priceRange = document.querySelector('#price-range');
const priceDisplay = document.querySelector('#price-display');
const productGrid = document.querySelector('#product-grid');
const emptyState = document.querySelector('#empty-state');
const resultCount = document.querySelector('#result-count');

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categorySelect.value;
  const maxPrice = parseFloat(priceRange.value);

  // Multi-faceted Declarative Filter Pipeline
  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  renderProducts(filtered);
}

function renderProducts(items) {
  productGrid.innerHTML = '';
  resultCount.textContent = `Showing ${items.length} ${items.length === 1 ? 'product' : 'products'}`;

  if (items.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  const fragment = document.createDocumentFragment();

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'badge';
    categoryBadge.textContent = product.category.toUpperCase();

    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `$${product.price.toFixed(2)}`;

    card.append(categoryBadge, title, price);
    fragment.appendChild(card);
  });

  productGrid.appendChild(fragment);
}

// Event Listeners
searchInput.addEventListener('input', applyFilters);
categorySelect.addEventListener('change', applyFilters);
priceRange.addEventListener('input', (e) => {
  priceDisplay.textContent = `$${e.target.value}`;
  applyFilters();
});

// Initial Render
applyFilters();
```

---

## Practice Quiz

### Q1: How does the multi-criteria filter pipeline combine search, category, and price checks?
- A) By chaining separate loops over the DOM
- B) By returning (matchesSearch && matchesCategory && matchesPrice) inside a single filter() predicate
- C) By sending an SQL query to the browser
- D) By reloading the page on each input
**Answer:** B
**Explanation:** Evaluating all three boolean conditions inside the callback of `Array.prototype.filter()` filters the dataset in a single, efficient pass.

### Q2: Why is DocumentFragment used when rendering filtered product cards?
- A) It prevents DOM reflows by collecting cards in an in-memory fragment and inserting them in a single operation
- B) It prevents CSS from loading
- C) It converts JSON to CSV
- D) It runs on a Web Worker
**Answer:** A
**Explanation:** `DocumentFragment` batches element insertions in memory, triggering only one browser reflow and repaint when attached to the active DOM tree.

### Q3: What event type triggers filter updates as the user moves the price range slider?
- A) click
- B) input
- C) blur
- D) submit
**Answer:** B
**Explanation:** The `input` event fires continuously in real-time as the slider knob is dragged, immediately updating the price label and catalog.

### Q4: How is case-insensitive matching ensured when searching product names?
- A) product.name === searchTerm
- B) product.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
- C) product.name.toUpperCase() == searchTerm
- D) Using encodeURIComponent
**Answer:** B
**Explanation:** Converting both the source string and the search query to lowercase with `.toLowerCase()` guarantees case-insensitive substring matching.

### Q5: What UI state is displayed when zero products match the filter criteria?
- A) A browser alert popup
- B) An empty state message element is revealed by removing the hidden class
- C) The whole webpage is cleared
- D) An Error is thrown to console
**Answer:** B
**Explanation:** When `items.length === 0`, the empty state container is shown (`classList.remove('hidden')`), informing the user that no products matched.
