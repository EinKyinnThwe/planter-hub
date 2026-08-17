import { useEffect, useState } from 'react';
import useAuthUser from './useAuthUser';
import { subscribeToOrders } from '../services/orderService';

export default function useOrders() {
    const { user } = useAuthUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setOrders([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToOrders(
        user.uid,
        (data) => {
            setOrders(data);
            setLoading(false);
        },
        (err) => {
            setError(err.message || 'Failed to load order history.');
            setLoading(false);
        }
        );

        return unsubscribe;
    }, [user]);

    return { orders, loading, error };
}