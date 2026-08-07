import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import QuantityStepper from '../components/QuantityStepper';
import useCart from '../hooks/useCart';
import useFavorites from '../hooks/useFavorites';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const PlantDetailScreen = ({ route, navigation }) => {
  const { plant } = route.params;
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);

  const hasDiscount = !!plant.discountPercent && !!plant.originalPrice;
  const total = (plant.price * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart(plant, quantity);
    Alert.alert('Added to cart', `${quantity} × ${plant.name} added.`);
  };

  const handleBuyNow = () => {
    addToCart(plant, quantity);
    Alert.alert('Buy now', 'Checkout is not wired up yet — UI only for now.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Icon header: back, share, cart, more */}
      <View style={styles.iconHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <View style={styles.iconHeaderRight}>
          <TouchableOpacity style={styles.iconButton} hitSlop={8}>
            <Text style={styles.iconText}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Cart')}
            hitSlop={8}
          >
            <Text style={styles.iconText}>🛍️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} hitSlop={8}>
            <Text style={styles.iconText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageBox}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{plant.category}</Text>
          </View>
          <Text style={styles.emoji}>{plant.emoji}</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>1/{plant.imageCount}</Text>
          </View>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.name}>{plant.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(plant.id)} hitSlop={8}>
            <Text style={styles.heart}>{isFavorite(plant.id) ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingText}>
            {plant.rating.toFixed(1)} ({plant.reviewCount})
          </Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.ratingText}>{plant.sold} sold</Text>
        </View>

        <View style={styles.priceRow}>
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{plant.discountPercent}%</Text>
            </View>
          )}
          <Text style={styles.price}>${plant.price.toFixed(2)}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>${plant.originalPrice.toFixed(2)}</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{plant.description}</Text>

        <View style={styles.buyRow}>
          <Text style={styles.sectionTitle}>Buy Item:</Text>
          <QuantityStepper
            quantity={quantity}
            onIncrease={() => setQuantity((q) => q + 1)}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          />
        </View>
      </ScrollView>

      {/* Sticky footer buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatButton} hitSlop={6}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to cart 🔒</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>Buy ${total}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  iconHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  iconHeaderRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: SPACING.md,
  },
  iconText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  container: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  imageBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  categoryTag: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(31,42,36,0.75)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  categoryTagText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 96,
  },
  counterBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(31,42,36,0.75)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  counterText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  heart: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.danger,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  star: {
    color: COLORS.star,
    fontSize: FONT_SIZES.md,
    marginRight: 4,
  },
  ratingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  dot: {
    marginHorizontal: SPACING.xs,
    color: COLORS.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  discountBadge: {
    backgroundColor: COLORS.discountBg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: SPACING.sm,
  },
  discountText: {
    color: COLORS.discountText,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  price: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  originalPrice: {
    fontSize: FONT_SIZES.md,
    color: COLORS.strikethrough,
    textDecorationLine: 'line-through',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  buyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  chatIcon: {
    fontSize: FONT_SIZES.lg,
  },
  addToCartButton: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  addToCartText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  buyButton: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});

export default PlantDetailScreen;
