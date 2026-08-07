import React from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Alert } from 'react-native';

import ScreenHeader from '../components/ScreenHeader';
import CartItemRow from '../components/CartItemRow';
import CustomButton from '../components/CustomButton';
import useCart from '../hooks/useCart';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const CartScreen = ({ navigation }) => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  const handleCheckout = () => {
    Alert.alert('Checkout', 'Checkout is not wired up yet — UI only for now.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="My Cart" showBack onBackPress={() => navigation.goBack()} />

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🪴</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.plant.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onIncrease={() => updateQuantity(item.plant.id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item.plant.id, item.quantity - 1)}
                onRemove={() => removeFromCart(item.plant.id)}
              />
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <CustomButton title="C H E C K O U T" onPress={handleCheckout} />
          </View>
        </>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
});

export default CartScreen;
