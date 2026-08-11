import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const LocationHeader = ({ city, cartCount, onCartPress, onBellPress }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Location</Text>
        <TouchableOpacity style={styles.cityRow} hitSlop={6}>
          <Text style={styles.pin}>📍</Text>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.chevron}>⌄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton} onPress={onCartPress} hitSlop={6}>
          <Text style={styles.icon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onBellPress} hitSlop={6}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pin: {
    fontSize: FONT_SIZES.sm,
    marginRight: 4,
  },
  city: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 4,
  },
  chevron: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  icons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    position: 'relative',
  },
  icon: {
    fontSize: FONT_SIZES.lg,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default LocationHeader;
