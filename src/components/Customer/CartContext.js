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
          let updatedRemoveItems = { ...state.items };
          if (itemToRemove && itemToRemove.cantidad > 1) {
            updatedRemoveItems[action.payload.id] = { ...itemToRemove, cantidad: itemToRemove.cantidad - 1 };
            return {
              ...state,
              items: updatedRemoveItems,
              totalItems: state.totalItems - 1
            };
          } else if (itemToRemove) {
            delete updatedRemoveItems[action.payload.id];
            return {
              ...state,
              items: updatedRemoveItems,
              totalItems: state.totalItems - 1
            };
          }
          return state;


          case 'CLEAR_CART':
    return {
        ...state,
        items: {}  // Asegúrate de que esto corresponda a cómo está estructurado tu estado inicial
    };

    
    case 'DELETE_ITEM':
      const { [action.payload.id]: removedItem, ...remainingItems } = state.items;
      const itemCountRemoved = removedItem ? removedItem.cantidad : 0;
      return {
        ...state,
        items: remainingItems,
        totalItems: state.totalItems - itemCountRemoved
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
