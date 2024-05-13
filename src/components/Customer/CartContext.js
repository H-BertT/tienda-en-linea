import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: {},
  totalItems: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
        const existingItem = state.items[action.payload.id];
        let updatedItems = { ...state.items };
        if (existingItem) {
            updatedItems[action.payload.id] = { ...existingItem, cantidad: existingItem.cantidad + 1 };
        } else {
            updatedItems[action.payload.id] = { ...action.payload, cantidad: 1 };
        }
        return {
            ...state,
            items: updatedItems,
            totalItems: state.totalItems + 1
        };       
    case 'REMOVE_ITEM':
      const itemToRemove = state.items[action.payload.id];
      if (itemToRemove && itemToRemove.cantidad > 1) {
        itemToRemove.cantidad -= 1;
      }
      return {
        ...state,
        items: { ...state.items },
        totalItems: state.totalItems - 1
      };
    case 'DELETE_ITEM':
      const newItems = { ...state.items };
      delete newItems[action.payload.id];
      return {
        ...state,
        items: newItems,
        totalItems: state.totalItems - (state.items[action.payload.id] ? state.items[action.payload.id].cantidad : 0)
      };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
