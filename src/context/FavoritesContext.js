import React, { createContext, useState } from 'react';

export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);

  const toggleFavorite = (plantId) => {
    setFavoriteIds((prev) =>
      prev.includes(plantId) ? prev.filter((id) => id !== plantId) : [...prev, plantId]
    );
  };

  const isFavorite = (plantId) => favoriteIds.includes(plantId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
