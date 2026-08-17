// src/services/productService.js
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    query,
    limit,
    writeBatch,
    onSnapshot,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import { PLANTS } from '../data/plants';

const PRODUCTS_COLLECTION = 'products';

export const seedProductsIfEmpty = async () => {
    const db = getFirestore();
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const existing = await getDocs(query(productsRef, limit(1)));

    if (!existing.empty) return;

    const batch = writeBatch(db);
    PLANTS.forEach((plant) => {
        const docRef = doc(productsRef, plant.id);
        batch.set(docRef, {
            ...plant,
            createdAt: serverTimestamp(),
        });
    });

    await batch.commit();
};

export const subscribeToProducts = (onData, onError) => {
    const db = getFirestore();
    const productsRef = collection(db, PRODUCTS_COLLECTION);

    return onSnapshot(
        productsRef,
        (snapshot) => {
            const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            onData(products);
        },
        (error) => {
            onError && onError(error);
        }
    );
};