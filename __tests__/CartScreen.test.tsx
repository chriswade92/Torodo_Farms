import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { CartScreen } from '../src/screens/CartScreen';
import { CartProvider } from '../src/contexts/CartContext';
import { SalesProvider } from '../src/contexts/SalesContext';

// Mock des contextes
jest.mock('../src/contexts/CartContext', () => ({
  useCart: () => ({
    items: [
      {
        product: { name: 'Lait Frais' },
        size: { size: 1, price: 1000 },
        quantity: 2
      }
    ],
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    total: 2000
  })
}));

jest.mock('../src/contexts/SalesContext', () => ({
  useSales: () => ({
    addSale: jest.fn()
  })
}));

describe('CartScreen', () => {
  it('affiche correctement les articles du panier', () => {
    const { getByText } = render(
      <CartProvider>
        <SalesProvider>
          <CartScreen />
        </SalesProvider>
      </CartProvider>
    );

    expect(getByText('Lait Frais')).toBeTruthy();
    expect(getByText('1L x 2')).toBeTruthy();
    expect(getByText('2000 CFA')).toBeTruthy();
  });

  it('affiche le message panier vide quand il n\'y a pas d\'articles', () => {
    jest.spyOn(require('../src/contexts/CartContext'), 'useCart')
      .mockImplementation(() => ({
        items: [],
        total: 0,
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn()
      }));

    const { getByText } = render(
      <CartProvider>
        <SalesProvider>
          <CartScreen />
        </SalesProvider>
      </CartProvider>
    );

    const confirmButton = getByText('Confirmer la commande');
    fireEvent.press(confirmButton);
    
    expect(getByText('Erreur')).toBeTruthy();
    expect(getByText('Votre panier est vide')).toBeTruthy();
  });

  it('permet de modifier la quantité d\'un article', () => {
    const mockUpdateQuantity = jest.fn();
    jest.spyOn(require('../src/contexts/CartContext'), 'useCart')
      .mockImplementation(() => ({
        items: [
          {
            product: { name: 'Lait Frais' },
            size: { size: 1, price: 1000 },
            quantity: 1
          }
        ],
        total: 1000,
        updateQuantity: mockUpdateQuantity,
        removeFromCart: jest.fn(),
        clearCart: jest.fn()
      }));

    const { getByText } = render(
      <CartProvider>
        <SalesProvider>
          <CartScreen />
        </SalesProvider>
      </CartProvider>
    );

    const plusButton = getByText('+');
    fireEvent.press(plusButton);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith(0, 2);
  });
}); 