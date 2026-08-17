import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

export default function useFavorites() {
    const ctx = useContext(FavoritesContext);

    if (!ctx) {
        throw new Error('useFavorites must be used inside a <FavoritesProvider>');
    }

    return ctx;
}
