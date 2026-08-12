// src/screens/NotificationDetailsScreen.js
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNotifications from '../hooks/useNotifications';
import { relativeTime } from '../utils/relativeTime';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const TYPE_META = {
  order: { emoji: '📦', label: 'Order' },
  restock: { emoji: '🌱', label: 'Restock' },
  promo: { emoji: '🎁', label: 'Promo' },
  default: { emoji: '🔔', label: 'Notification' },
};

const NotificationDetailsScreen = ({ route, navigation }) => {
  const { notification } = route.params || {};
  const { markAsRead } = useNotifications();

  useEffect(() => {
    if (notification?.id) {
      markAsRead(notification.id);
    }
  }, [notification?.id, markAsRead]);

  if (!notification) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <Text style={styles.backArrow}>{'\u2190'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification Detail</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Notification not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const meta = TYPE_META[notification.data?.type] || TYPE_META.default;
  const timeLabel = notification.receivedAt
    ? relativeTime(notification.receivedAt)
    : '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{meta.emoji}</Text>
          </View>
          <Text style={styles.typeLabel}>{meta.label}</Text>
        </View>

        <Text style={styles.title}>{notification.title}</Text>

        {timeLabel ? (
          <Text style={styles.time}>Received {timeLabel}</Text>
        ) : null}

        <View style={styles.divider} />

        <Text style={styles.body}>{notification.body || '—'}</Text>

        {notification.data?.plantId ? (
          <TouchableOpacity
            style={styles.plantButton}
            onPress={() =>
              navigation.navigate('PlantDetail', {
                plantId: notification.data.plantId,
              })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.plantButtonText}>View Plant</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight || COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  iconEmoji: {
    fontSize: 22,
  },
  typeLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  time: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textFaint || COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    marginBottom: SPACING.md,
  },
  body: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  plantButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md || 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  plantButtonText: {
    color: COLORS.white || '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
});

export default NotificationDetailsScreen;