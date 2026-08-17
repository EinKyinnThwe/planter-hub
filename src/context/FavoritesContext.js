import React, { createContext, useEffect, useState } from 'react';
import useAuthUser from '../hooks/useAuthUser';
import {
    subscribeToFavorites,
    addFavorite,
    removeFavorite,
} from '../services/favoritesService';

export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuthUser();
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        if (!user) {
            setFavoriteIds([]); // signed out — nothing to show
            return;
        }

        const unsubscribe = subscribeToFavorites(
            user.uid,
            (ids) => setFavoriteIds(ids),
            (err) => console.warn('Favorites listener error:', err.message)
        );

        return unsubscribe;
    }, [user]);

    const toggleFavorite = async (plantId) => {
        if (!user) return;

        const isCurrentlyFavorite = favoriteIds.includes(plantId);
        // Optimistic update — the onSnapshot listener will reconcile shortly after.
        setFavoriteIds((prev) =>
            isCurrentlyFavorite ? prev.filter((id) => id !== plantId) : [...prev, plantId]
        );

        try {
            if (isCurrentlyFavorite) {
                await removeFavorite(user.uid, plantId);
            } else {
                await addFavorite(user.uid, plantId);
            }
        } catch (err) {
            // Revert the optimistic update if the write failed.
            setFavoriteIds((prev) =>
                isCurrentlyFavorite ? [...prev, plantId] : prev.filter((id) => id !== plantId)
            );
        }
    };

    const isFavorite = (plantId) => favoriteIds.includes(plantId);

    return (
        <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};