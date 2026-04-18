'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
  details: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  favorites: string[];
  toast: string | null;
}

type Action =
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'REMOVE_FROM_CART'; id: string; size: string; color: string }
  | { type: 'UPDATE_QTY'; id: string; size: string; color: string; qty: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; id: string }
  | { type: 'SET_TOAST'; message: string | null };

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.findIndex(
        i => i.product.id === action.item.product.id &&
             i.size === action.item.size &&
             i.color === action.item.color
      );
      if (existing >= 0) {
        const updated = [...state.cart];
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + action.item.quantity };
        return { ...state, cart: updated };
      }
      return { ...state, cart: [...state.cart, action.item] };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(
          i => !(i.product.id === action.id && i.size === action.size && i.color === action.color)
        )
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        cart: state.cart.map(i =>
          i.product.id === action.id && i.size === action.size && i.color === action.color
            ? { ...i, quantity: action.qty }
            : i
        ).filter(i => i.quantity > 0)
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.id)
          ? state.favorites.filter(id => id !== action.id)
          : [...state.favorites, action.id]
      };
    case 'SET_TOAST':
      return { ...state, toast: action.message };
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<Action>;
  cartCount: number;
  cartTotal: number;
  showToast: (msg: string) => void;
} | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    cart: [],
    favorites: [],
    toast: null,
  });

  const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const showToast = (msg: string) => {
    dispatch({ type: 'SET_TOAST', message: msg });
    setTimeout(() => dispatch({ type: 'SET_TOAST', message: null }), 3000);
  };

  return (
    <StoreContext.Provider value={{ state, dispatch, cartCount, cartTotal, showToast }}>
      {children}
      {state.toast && (
        <div className="toast">{state.toast}</div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
