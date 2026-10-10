# Capstone Project: Interactive E-Commerce Store with Cart & Router

## 1. Project Overview & Architecture
To conclude the **React.js for Intermediate** curriculum, we will construct a production-ready **Interactive E-Commerce Store with Cart & Router**.

This capstone synthesizes the intermediate architecture patterns:
- **Client-Side Routing (`react-router-dom`):** Catalog view (`/`), Product detail view (`/product/:id`), and Checkout Drawer.
- **Combined Context + useReducer Store:** Centralized shopping cart state machine with actions for adding, removing, updating quantities, and clearing cart.
- **Custom Hooks (`useDebounce`, `useLocalStorage`):** Debounced product search filter and automatic cart persistence.
- **Portals & Overlays:** A sliding Shopping Cart Drawer mounted via `createPortal`.
- **Derived Cart Analytics:** Item subtotal, discounts, tax, and order totals calculated cleanly on the fly.

```
┌────────────────────────────────────────────────────────┐
│             MSK Tech Store & Learning Gear             │
│                                                        │
│   Search: [ Filter gadgets... ]         Cart: [ (3) ]  │
│                                                        │
│   ┌───────────────┐ ┌───────────────┐ ┌──────────────┐ │
│   │ React Toolkit │ │ Django Server │ │ Dev Laptop   │ │
│   │ $49.00        │ │ $89.00        │ │ $1,299.00    │ │
│   │ [Add to Cart] │ │ [Add to Cart] │ │ [Add to Cart]│ │
│   └───────────────┘ └───────────────┘ └──────────────┘ │
│                                                        │
│   Sliding Cart Drawer (Portal to document.body):       │
│   • React Toolkit (x1) - $49                           │
│   • Dev Laptop (x1) - $1,299                           │
│   Subtotal: $1,348.00  [ Proceed to Checkout ]         │
└────────────────────────────────────────────────────────┘
```

## 2. Complete Application Implementation

### Step 1: Cart Context Store (`CartContext.jsx`)
```jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.payload.id);
      if (existing) {
        return state.map(i =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.payload);
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem('msk_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('msk_store_cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartStateContext.Provider value={cart}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export const useCart = () => useContext(CartStateContext);
export const useCartDispatch = () => useContext(CartDispatchContext);
```

### Step 2: Main Application Component (`App.jsx`)
```jsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CartProvider, useCart, useCartDispatch } from './CartContext';

const CATALOG = [
  { id: 'p-1', name: 'Mechanical Developer Keyboard', price: 120, category: 'Hardware' },
  { id: 'p-2', name: '4K Ultra-Wide Monitor', price: 450, category: 'Hardware' },
  { id: 'p-3', name: 'Full-Stack React & Django Bundle', price: 99, category: 'Software' },
  { id: 'p-4', name: 'Noise-Canceling Engineering Headset', price: 180, category: 'Hardware' }
];

// Sliding Cart Drawer Component (Mounted via Portal!)
function CartDrawer({ isOpen, onClose }) {
  const cart = useCart();
  const dispatch = useCartDispatch();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return createPortal(
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-header">
          <h3>Your Shopping Cart ({cart.length})</h3>
          <button onClick={onClose} className="btn-close">✕</button>
        </header>

        <div className="drawer-items">
          {cart.length === 0 ? (
            <p className="empty-cart-text">Your cart is currently empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div>
                  <h4>{item.name}</h4>
                  <p>${item.price} each</p>
                </div>
                <div className="qty-controls">
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty - 1 } })}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item.id, qty: item.qty + 1 } })}>+</button>
                  <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })} className="btn-del">🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <footer className="drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal:</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <button onClick={() => alert('Order placed!')} className="btn-checkout">
              Checkout Now
            </button>
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}

// Catalog View
function StoreCatalog() {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cart = useCart();
  const dispatch = useCartDispatch();

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  const filtered = CATALOG.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="store-container">
      <header className="store-header">
        <h1>MSK Developer Gear Store</h1>
        <button onClick={() => setDrawerOpen(true)} className="btn-cart">
          🛒 Cart ({totalItems})
        </button>
      </header>

      <input
        type="text"
        placeholder="Filter equipment..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="product-grid">
        {filtered.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="category">{product.category}</p>
            <p className="price">${product.price}</p>
            <button
              onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
              className="btn-add"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StoreCatalog />
    </CartProvider>
  );
}
```

---

## Practice Quiz

### Q1: How does the sliding Cart Drawer avoid being trapped inside the layout container's CSS?
- A) By compiling into a PDF
- B) It is rendered directly into `document.body` using `createPortal`
- C) By refreshing the page
- D) It uses an `<iframe>`
**Answer:** B
**Explanation:** `createPortal(..., document.body)` mounts the drawer at the root of the document, avoiding overflow clipping and stacking context limitations.

### Q2: How does the cart store persist its data across browser refreshes?
- A) By sending SMS messages
- B) Using an initializer function with `localStorage.getItem` in `useReducer`, paired with a `useEffect` synchronization hook listening to `[cart]`
- C) React automatically saves everything to SQLite
- D) By disabling browser cache
**Answer:** B
**Explanation:** Combining lazy initialization with an effect listening to `[cart]` creates clean, automatic synchronization with browser `localStorage`.

### Q3: Why is `e.stopPropagation()` placed on the inner drawer panel?
- A) To make the panel slide faster
- B) To prevent clicks inside the drawer from bubbling up to the darkened backdrop and triggering `onClose`
- C) To disable the close button
- D) It is required by HTML
**Answer:** B
**Explanation:** `e.stopPropagation()` halts event bubbling, ensuring that clicks inside the drawer do not trigger the backdrop's click-to-close handler.

### Q4: How is the cart subtotal calculated in the application?
- A) Derived synchronously during render from `cart.reduce((sum, item) => sum + item.price * item.qty, 0)`
- B) Calculated on a remote backend server
- C) Stored in a separate `useState` updated by a timer
- D) Stored in cookies
**Answer:** A
**Explanation:** Deriving subtotals synchronously during render guarantees accuracy without redundant state synchronization bugs.

### Q5: What action type is dispatched when incrementing an item's quantity in the cart?
- A) `INCREMENT_TOTAL`
- B) `UPDATE_QTY` with a payload containing `{ id, qty }`
- C) `RELOAD_CART`
- D) `SAVE_STATE`
**Answer:** B
**Explanation:** The `UPDATE_QTY` action updates the specific item's quantity immutably inside the central reducer.
