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

    const orderRef = doc(collection(db, ORDERS_COLLECTION));
    batch.set(orderRef, {
        uid,
        items: orderItems,
        totalPrice,
        status: 'completed',
        createdAt: serverTimestamp(),
    });

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