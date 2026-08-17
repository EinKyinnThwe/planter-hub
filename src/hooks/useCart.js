import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function useCart() {
    const ctx = useContext(CartContext);

    if (!ctx) {
        throw new Error('useCart must be used inside a <CartProvider>');
    }
    const totalItems = ctx.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = ctx.items.reduce(
        (sum, i) => sum + i.quantity * i.plant.price, 0
    );
    return { ...ctx, totalItems, totalPrice };
}
