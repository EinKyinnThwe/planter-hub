import React, { useEffect } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import CartItemRow from '../components/CartItemRow';
import CustomButton from '../components/CustomButton';

import useCart from '../hooks/useCart';
import useCheckout from '../hooks/useCheckout';

import {
  COLORS,
  SPACING,
  FONT_SIZES,
} from '../constants/theme';

import {
  logButtonClick,
  logScreenView,
  logErrorToCrashlytics,
} from '../services/analyticsService';

const CartScreen = ({ navigation }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  /**
   * Screen analytics.
   */
  useEffect(() => {
    logScreenView('CartScreen');
  }, []);

  /**
   * Checkout.
   */
  const {
    checkout,
    loading,
    error,
  } = useCheckout(() => {
    navigation.navigate('Main', {
      screen: 'History',
    });
  });

  /**
   * Back button.
   */
  const handleBack = async () => {
    console.log('Cart back pressed');

    // Do not let analytics prevent navigation.
    logButtonClick(
      'back',
      'CartScreen'
    );

    navigation.goBack();
  };

  /**
   * Increase quantity.
   */
  const handleIncrease = (item) => {
    try {
      const newQuantity =
        item.quantity + 1;

      console.log(
        'Increasing quantity:',
        item.plant.id,
        newQuantity
      );

      // Analytics is intentionally NOT awaited.
      // It cannot block the cart operation.
      logButtonClick(
        'cart_quantity_increase',
        'CartScreen',
        {
          product_id: String(
            item.plant.id
          ),
          product_name: item.plant.name
            ? String(item.plant.name)
            : undefined,
          old_quantity: item.quantity,
          new_quantity: newQuantity,
        }
      );

      updateQuantity(
        item.plant.id,
        newQuantity
      );
    } catch (error) {
      console.error(
        'Increase quantity failed:',
        error
      );

      logErrorToCrashlytics(
        error,
        'Failed to increase cart item quantity'
      );
    }
  };

  /**
   * Decrease quantity.
   */
  const handleDecrease = (item) => {
    try {
      const newQuantity =
        Math.max(
          1,
          item.quantity - 1
        );

      console.log(
        'Decreasing quantity:',
        item.plant.id,
        newQuantity
      );

      logButtonClick(
        'cart_quantity_decrease',
        'CartScreen',
        {
          product_id: String(
            item.plant.id
          ),
          product_name: item.plant.name
            ? String(item.plant.name)
            : undefined,
          old_quantity: item.quantity,
          new_quantity: newQuantity,
        }
      );

      updateQuantity(
        item.plant.id,
        newQuantity
      );
    } catch (error) {
      console.error(
        'Decrease quantity failed:',
        error
      );

      logErrorToCrashlytics(
        error,
        'Failed to decrease cart item quantity'
      );
    }
  };

  /**
   * Remove item.
   */
  const handleRemove = (item) => {
    try {
      console.log(
        'Removing product:',
        item.plant.id
      );

      logButtonClick(
        'remove_from_cart',
        'CartScreen',
        {
          product_id: String(
            item.plant.id
          ),
          product_name: item.plant.name
            ? String(item.plant.name)
            : undefined,
          quantity: item.quantity,
        }
      );

      removeFromCart(
        item.plant.id
      );
    } catch (error) {
      console.error(
        'Remove item failed:',
        error
      );

      logErrorToCrashlytics(
        error,
        'Failed to remove item from cart'
      );
    }
  };

  /**
   * Checkout.
   */
  const handleCheckout = async () => {
    try {
      console.log(
        'Checkout pressed'
      );

      logButtonClick(
        'checkout',
        'CartScreen',
        {
          item_count: items.length,
          total_quantity: items.reduce(
            (sum, item) =>
              sum + item.quantity,
            0
          ),
          total_price: Number(
            totalPrice.toFixed(2)
          ),
        }
      );

      await checkout();
    } catch (error) {
      console.error(
        'Checkout failed:',
        error
      );

      logErrorToCrashlytics(
        error,
        'Checkout failed from CartScreen'
      );
    }
  };

  /**
   * Checkout error.
   */
  useEffect(() => {
    if (error) {
      logErrorToCrashlytics(
        error,
        'CartScreen checkout error'
      );
    }
  }, [error]);

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScreenHeader
        title="My Cart"
        showBack
        onBackPress={handleBack}
      />

      {items.length === 0 ? (
        <View
          style={styles.emptyState}
        >
          <Text
            style={styles.emptyEmoji}
          >
            🪴
          </Text>

          <Text
            style={styles.emptyText}
          >
            Your cart is empty
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) =>
              String(item.plant.id)
            }
            contentContainerStyle={
              styles.listContent
            }
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onIncrease={() =>
                  handleIncrease(item)
                }
                onDecrease={() =>
                  handleDecrease(item)
                }
                onRemove={() =>
                  handleRemove(item)
                }
              />
            )}
          />

          <View
            style={styles.footer}
          >
            {error && (
              <Text
                style={styles.errorText}
              >
                {error}
              </Text>
            )}

            <View
              style={styles.totalRow}
            >
              <Text
                style={styles.totalLabel}
              >
                Total
              </Text>

              <Text
                style={styles.totalValue}
              >
                $
                {totalPrice.toFixed(2)}
              </Text>
            </View>

            <CustomButton
              title="Checkout"
              onPress={handleCheckout}
              loading={loading}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  listContent: {
    paddingHorizontal:
      SPACING.lg,
    paddingBottom:
      SPACING.md,
  },

  footer: {
    paddingHorizontal:
      SPACING.lg,
    paddingTop:
      SPACING.md,
    paddingBottom:
      SPACING.lg,
    borderTopWidth: 1,
    borderTopColor:
      COLORS.inputBorder,
  },

  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom:
      SPACING.sm,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom:
      SPACING.md,
  },

  totalLabel: {
    fontSize:
      FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },

  totalValue: {
    fontSize:
      FONT_SIZES.lg,
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
    marginBottom:
      SPACING.sm,
  },

  emptyText: {
    fontSize:
      FONT_SIZES.md,
    color:
      COLORS.textMuted,
  },
});

export default CartScreen;
