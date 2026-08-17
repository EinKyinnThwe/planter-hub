import React, { createContext, useState } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]); // [{ plant, quantity }]

    const addToCart = (plant, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.plant.id === plant.id);
            if (existing) {
                return prev.map((i) =>
                    i.plant.id === plant.id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prev, { plant, quantity }];
        });
    };

    const removeFromCart = (plantId) => {
        setItems((prev) => prev.filter((i) => i.plant.id !== plantId));
    };

    const updateQuantity = (plantId, quantity) => {
        setItems((prev) =>
            prev.map((i) =>
                i.plant.id === plantId ? { ...i, quantity: Math.max(1, quantity) } : i
            )
        );
    };

    const clearCart = () => setItems([]);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
