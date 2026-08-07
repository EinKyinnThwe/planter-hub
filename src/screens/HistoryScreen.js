import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const HistoryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="History" />
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>🕐</Text>
        <Text style={styles.emptyText}>No orders yet</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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

export default HistoryScreen;
