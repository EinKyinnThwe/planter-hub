import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

import LocationHeader from '../components/LocationHeader';
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import SectionHeader from '../components/SectionHeader';
import CategoryChip from '../components/CategoryChip';
import CategoryGridItem from '../components/CategoryGridItem';
import PlantCard from '../components/PlantCard';
import useCart from '../hooks/useCart';
import useFavorites from '../hooks/useFavorites';
import useProducts from '../hooks/useProducts';
import useNotifications from '../hooks/useNotifications';
import { CATEGORY_CHIPS, CATEGORIES } from '../data/categories';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const { totalItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { products, loading, error } = useProducts(); // live Firestore data
  const { unreadCount } = useNotifications();
  const [search, setSearch] = useState('');
  const [activeChip, setActiveChip] = useState('All');

  const openDetail = (plant) => navigation.navigate('PlantDetail', { plant });

  const filteredPlants =
    activeChip === 'All' ? products : products.filter((p) => p.category === activeChip);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading plants…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LocationHeader
          city="San Jose, California"
          cartCount={totalItems}
          onCartPress={() => navigation.navigate('Cart')}
          bellCount={unreadCount}
          onBellPress={() => navigation.navigate('Notifications')}
        />

        <SearchBar value={search} onChangeText={setSearch} onFilterPress={() => {}} />

        <SectionHeader title="Special Promo for You" />
        <PromoBanner
          percent="25%"
          subtext="First transaction up to $500"
          dateRange="25 - 29 June 2026"
          onShopPress={() => {}}
        />

        <SectionHeader
          title="Recommended for You"
          onSeeAllPress={() =>
            navigation.navigate('AllProducts', { title: 'Recommended for You' })
          }
        />
        <FlatList
          data={products.slice(0, 6)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPress={() => openDetail(item)}
              style={styles.horizontalCard}
            />
          )}
        />

        <SectionHeader
          title="Shop by Category"
          onSeeAllPress={() => navigation.navigate('AllProducts', { title: 'Shop by Category' })}
        />
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <CategoryGridItem
              key={category.id}
              category={category}
              onPress={() => setActiveChip(category.label)}
            />
          ))}
        </View>

        <SectionHeader
          title="Special Offers"
          onSeeAllPress={() =>
            navigation.navigate('AllProducts', {
              title: 'Special Offers',
              initialCategory: activeChip,
            })
          }
        />
        <FlatList
          data={CATEGORY_CHIPS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipListWrapper}
          contentContainerStyle={styles.chipList}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              active={activeChip === item}
              onPress={() => setActiveChip(item)}
            />
          )}
        />

        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPress={() => openDetail(item)}
              style={styles.horizontalCard}
            />
          )}
        />

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  horizontalList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  horizontalCard: {
    width: 170,
    marginRight: SPACING.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
  },
  chipListWrapper: {
    flexGrow: 0,
  },
  chipList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    alignItems: 'center',
  },
});

export default HomeScreen;