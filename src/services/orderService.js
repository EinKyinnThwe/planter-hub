// src/services/orderService.js
// "Checkout" in this app skips real payment — it just records the order
// and bumps each purchased plant's `sold` count, in one atomic batch.

import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
} from '@react-native-firebase/firestore';

const ORDERS_COLLECTION = 'orders';
const PRODUCTS_COLLECTION = 'products';

/**
 * Creates an order document from the current cart contents AND increments
 * `sold` on each purchased product by its quantity — same batch, so the
 * order and the sold-count update are atomic.
 */
export const createOrder = async (uid, cartItems, totalPrice) => {
  const db = getFirestore();
  const batch = writeBatch(db);

  const orderItems = cartItems.map(({ plant, quantity }) => ({
    plantId: plant.id,
    name: plant.name,
    emoji: plant.emoji,
    price: plant.price,
    quantity,
  }));

  // 1. Create the order doc (generate the ref first so we can batch it).
  const orderRef = doc(collection(db, ORDERS_COLLECTION));
  batch.set(orderRef, {
    uid,
    items: orderItems,
    totalPrice,
    status: 'completed',
    createdAt: serverTimestamp(),
  });

  // 2. Bump `sold` on every purchased product by its quantity.
  cartItems.forEach(({ plant, quantity }) => {
    const productRef = doc(db, PRODUCTS_COLLECTION, plant.id);
    batch.update(productRef, { 
      sold: increment(quantity),
      stock: increment(-quantity)
    });
  });

  await batch.commit();

  return orderRef.id;
};

/**
 * Real-time listener for one user's own order history, newest first.
 * Call the returned function to unsubscribe.
 */
export const subscribeToOrders = (uid, onData, onError) => {
  const db = getFirestore();
  const ordersQuery = query(
    collection(db, ORDERS_COLLECTION),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(orders);
    },
    (error) => onError && onError(error)
  );
};