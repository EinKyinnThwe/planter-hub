import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import PlantCard from '../components/PlantCard';
import useFavorites from '../hooks/useFavorites';
import { PLANTS } from '../data/plants';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const FavoriteScreen = ({ navigation }) => {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const favoritePlants = PLANTS.filter((p) => favoriteIds.includes(p.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Favorites" showBack onBackPress={() => navigation.goBack()}/>

      {favoritePlants.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>♡</Text>
          <Text style={styles.emptyText}>No favorites yet</Text>
        </View>
      ) : (
        <FlatList
          data={favoritePlants}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPress={() => navigation.navigate('PlantDetail', { plant: item })}
              style={styles.gridCard}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  gridCard: {
    flex: 1,
    margin: SPACING.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 56,
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
});

export default FavoriteScreen;
