import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/type';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    }
    const cart = JSON.parse(serializedCart);
    
    // Validate the loaded data structure
    if (cart && Array.isArray(cart.items)) {
      return cart;
    }
    return {
      items: [],
      total: 0,
      itemCount: 0,
    };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return {
      items: [],
      total: 0,
      itemCount: 0,
    };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart: CartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
          quantity: 1,
        });
      }
      
      // Recalculate totals
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalculate totals
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
        
        // Recalculate totals
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

// Create a middleware to save cart to localStorage after each action
export const cartMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Only save if the action is from the cart slice
  if (action.type.startsWith('cart/')) {
    const cartState = store.getState().cart;
    saveCartToStorage(cartState);
  }
  
  return result;
};

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
