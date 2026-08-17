import { useState } from 'react';
import useAuthUser from './useAuthUser';
import useCart from './useCart';
import { createOrder } from '../services/orderService';

export default function useCheckout(onSuccess) {
    const { user } = useAuthUser();
    const { items, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkout = async () => {
        if (!user) {
            setError('You need to be signed in to check out.');
            return;
        }
        if (items.length === 0) {
            setError('Your cart is empty.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const orderId = await createOrder(user.uid, items, totalPrice);
            clearCart();
            onSuccess && onSuccess(orderId);
        } catch (err) {
            setError(err.message || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return { checkout, loading, error };
}