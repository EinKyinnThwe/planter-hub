// src/hooks/useProducts.js
// Subscribes to Firestore's "products" collection in real time.
// Replaces the static PLANTS import in screens that list products.

import { useEffect, useState } from 'react';
import { subscribeToProducts } from '../services/productService';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (data) => {
        setProducts(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to load products.');
        setLoading(false);
      }
    );

    return unsubscribe; // detach the listener when the screen unmounts
  }, []);

  return { products, loading, error };
}
